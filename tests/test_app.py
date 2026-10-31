from __future__ import annotations

from pathlib import Path

from streamlit.testing.v1 import AppTest

APP_PATH = Path(__file__).resolve().parents[1] / "app.py"


def test_streamlit_demo_flow_renders_dashboard(monkeypatch) -> None:
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)

    app = AppTest.from_file(str(APP_PATH), default_timeout=180).run()
    assert not app.exception

    next(button for button in app.button if "Load" in button.label).click().run()
    next(button for button in app.button if "Analyze" in button.label).click().run(
        timeout=180
    )

    assert not app.exception
    metrics = {metric.label: metric.value for metric in app.metric}
    assert int(metrics["Verified Facts"]) > 0
    assert int(metrics["Information Gaps"]) > 0
    assert int(metrics["Conflicting Claims"]) > 0
    assert len(app.session_state["last_sources"]) == 3
