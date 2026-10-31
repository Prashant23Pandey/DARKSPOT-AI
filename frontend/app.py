"""
frontend/app.py

Digital Dark Spot — Investigative Verification & Truth Radar
Streamlit multi-tab user interface with explicit evidence markers and instant demo loading.
"""

import sys
import json
from pathlib import Path
import streamlit as st

# Ensure repository root is on sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.engine import (
    GapEngineResponse,
    prepare_source_payload,
    analyze_sources_with_gemini
)

st.set_page_config(
    page_title="Digital Dark Spot | Truth & Gap Radar",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom High-Aesthetic Styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .main-header {
        background: linear-gradient(135deg, #1e1e2f 0%, #11111b 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 28px 32px;
        margin-bottom: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    .badge-signal {
        display: inline-block;
        background: rgba(239, 68, 68, 0.12);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.76rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }
    .source-pill {
        display: inline-flex;
        align-items: center;
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
        border: 1px solid rgba(99, 102, 241, 0.35);
        border-radius: 6px;
        padding: 2px 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.78rem;
        font-weight: 500;
        margin-right: 6px;
        margin-top: 4px;
    }
    .evidence-card {
        background: #181825;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 18px 20px;
        margin-bottom: 14px;
        transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .evidence-card:hover {
        border-color: rgba(99, 102, 241, 0.4);
        transform: translateY(-2px);
    }
    .conflict-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-top: 10px;
    }
    .claim-box-a {
        background: rgba(245, 158, 11, 0.08);
        border-left: 3px solid #f59e0b;
        border-radius: 8px;
        padding: 12px 14px;
        font-size: 0.9rem;
    }
    .claim-box-b {
        background: rgba(239, 68, 68, 0.08);
        border-left: 3px solid #ef4444;
        border-radius: 8px;
        padding: 12px 14px;
        font-size: 0.9rem;
    }
    .severity-HIGH {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        border: 1px solid #ef4444;
    }
    .severity-MEDIUM {
        background: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
        border: 1px solid #f59e0b;
    }
    .severity-LOW {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        border: 1px solid #3b82f6;
    }
    .priority-badge {
        background: #313244;
        color: #cdd6f4;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
        margin-right: 10px;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Sidebar Configuration
# ---------------------------------------------------------

with st.sidebar:
    st.title("⚙️ Engine Control")
    st.markdown("Cross-examine multiple documents and reveal contradictions and omissions.")

    gemini_key = st.text_input(
        "Gemini API Key",
        type="password",
        help="Optional. Leave empty to use Mock Blueprint Mode or set via GEMINI_API_KEY environment variable.",
        placeholder="AIzaSy..."
    )

    model_choice = st.selectbox(
        "Gemini Model",
        options=["gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
        index=0
    )

    st.divider()
    st.subheader("💡 Judge Demo Loader")
    sample_file = ROOT_DIR / "sample_data" / "scholarship_sources.json"
    
    if st.button("⚡ Load Scholarship Demo Sources", use_container_width=True):
        if sample_file.exists():
            with open(sample_file, "r", encoding="utf-8") as f:
                s_data = json.load(f)
                sources_list = s_data.get("sources", [])
                st.session_state["demo_urls"] = ""
                st.session_state["demo_text_1"] = f"{sources_list[0]['title']}: {sources_list[0]['text']}" if len(sources_list) > 0 else ""
                st.session_state["demo_text_2"] = f"{sources_list[1]['title']}: {sources_list[1]['text']}" if len(sources_list) > 1 else ""
                st.session_state["demo_text_3"] = f"{sources_list[2]['title']}: {sources_list[2]['text']}" if len(sources_list) > 2 else ""
                st.session_state["last_analysis"] = s_data.get("expected_truth_radar")
                st.session_state["last_sources"] = [
                    {"id": s["id"], "name": s["title"], "type": s["type"], "origin": s["url"], "content": s["text"]}
                    for s in sources_list
                ]
            st.rerun()

    st.markdown("---")
    st.caption("Schema: `backend/engine.py` | Google GenAI SDK")


# ---------------------------------------------------------
# Main Header
# ---------------------------------------------------------

st.markdown("""
<div class="main-header">
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <span class="badge-signal">Truth & Verification Radar</span>
            <h1 style="margin: 8px 0 6px 0; font-size: 2.1rem; font-weight: 800; color: #ffffff;">
                Digital Dark Spot
            </h1>
            <p style="margin: 0; color: #a6adc8; font-size: 1rem;">
                Ingest web URLs and raw documents to uncover <b>information gaps</b>, <b>conflicting claims</b>, and <b>outdated dates</b> with strict source attribution.
            </p>
        </div>
        <div style="text-align: right; font-size: 2.4rem;">
            🎯
        </div>
    </div>
</div>
""", unsafe_allow_html=True)


# ---------------------------------------------------------
# Input Section
# ---------------------------------------------------------

col_url, col_text = st.columns([1, 1])

with col_url:
    st.subheader("🌐 Ingest Web URLs")
    urls_input = st.text_area(
        "Enter URLs (one per line):",
        value=st.session_state.get("demo_urls", ""),
        height=140,
        placeholder="https://example.com/scholarship-guidelines\nhttps://example.com/admissions-faq"
    )

with col_text:
    st.subheader("📄 Ingest Text Documents")
    text_snippets = []
    
    t1 = st.text_area(
        "Source Excerpt A:",
        value=st.session_state.get("demo_text_1", ""),
        height=65,
        placeholder="Paste excerpt from first document..."
    )
    t2 = st.text_area(
        "Source Excerpt B:",
        value=st.session_state.get("demo_text_2", ""),
        height=65,
        placeholder="Paste excerpt from second document..."
    )
    t3 = st.text_area(
        "Source Excerpt C (Optional):",
        value=st.session_state.get("demo_text_3", ""),
        height=65,
        placeholder="Paste excerpt from archived or third document..."
    )
    
    for t in [t1, t2, t3]:
        if t.strip():
            text_snippets.append(t.strip())

run_btn = st.button("🚀 Analyze Information Gaps & Conflicts", type="primary", use_container_width=True)


# ---------------------------------------------------------
# Execution & Multi-tab Widget Rendering
# ---------------------------------------------------------

if run_btn:
    url_list = [u.strip() for u in urls_input.splitlines() if u.strip()]
    
    with st.spinner("Scraping clean text and synthesizing verification audit with Gemini..."):
        sources = prepare_source_payload(urls=url_list, raw_texts=text_snippets)
        
        if not sources:
            st.warning("Please provide at least one URL or text excerpt to analyze.")
            st.stop()
            
        analysis_response = analyze_sources_with_gemini(
            sources=sources,
            api_key=gemini_key,
            model_name=model_choice
        )
        
        st.session_state["last_analysis"] = analysis_response.model_dump()
        st.session_state["last_sources"] = sources

if "last_analysis" in st.session_state and st.session_state["last_analysis"]:
    data = st.session_state["last_analysis"]
    sources = st.session_state.get("last_sources", [])

    st.markdown("---")
    
    # Overview KPI Metrics
    m1, m2, m3, m4, m5 = st.columns(5)
    with m1:
        st.metric("Verified Facts", len(data.get("structured_summary", [])))
    with m2:
        st.metric("Information Gaps", len(data.get("information_gaps", [])), delta="Omissions", delta_color="inverse")
    with m3:
        st.metric("Conflicting Claims", len(data.get("conflicts", [])), delta="Discrepancies", delta_color="inverse")
    with m4:
        st.metric("Outdated Warnings", len(data.get("outdated_warnings", [])))
    with m5:
        st.metric("Checklist Steps", len(data.get("verification_checklist", [])))

    tabs = st.tabs([
        "⚠️ Information Gaps",
        "⚡ Conflicting Claims",
        "📋 Structured Summary",
        "⏳ Outdated Warnings",
        "✅ Verification Checklist",
        "📦 Raw Blueprint JSON"
    ])

    # 1. INFORMATION GAPS TAB
    with tabs[0]:
        st.markdown("### Missing Context & Information Gaps")
        st.caption("Critical policies, renewal terms, or deadlines omitted across the provided sources.")
        gaps = data.get("information_gaps", [])
        if not gaps:
            st.success("No critical information gaps identified.")
        else:
            for gap in gaps:
                sev = gap.get("severity", "MEDIUM").upper()
                st.markdown(f"""
                <div class="evidence-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 1.15rem; font-weight: 700; color: #f2cdcd;">{gap.get('gap_title')}</span>
                        <span class="badge-signal severity-{sev}">{sev} SEVERITY</span>
                    </div>
                    <p style="margin: 6px 0 12px 0; color: #bac2de; font-size: 0.95rem; line-height: 1.5;">
                        {gap.get('description')}
                    </p>
                    <div>
                        <span class="badge-signal" style="background: rgba(203, 166, 247, 0.15); color: #cba6f7; border-color: rgba(203, 166, 247, 0.3);">
                            🏷️ {gap.get('signal_label', 'Potential Gap — Unverified in provided sources')}
                        </span>
                    </div>
                </div>
                """, unsafe_allow_html=True)

    # 2. CONFLICTS TAB
    with tabs[1]:
        st.markdown("### Conflicting Claims & Contradictions")
        st.caption("Direct contradictions between source statements.")
        conflicts = data.get("conflicts", [])
        if not conflicts:
            st.success("No contradictory claims detected between sources.")
        else:
            for c in conflicts:
                sources_html = "".join([f'<span class="source-pill">🔗 {s}</span>' for s in c.get("sources", [])])
                st.markdown(f"""
                <div class="evidence-card">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 1.15rem; font-weight: 700; color: #fab387;">⚡ {c.get('issue')}</span>
                        <div>{sources_html}</div>
                    </div>
                    <div class="conflict-container">
                        <div class="claim-box-a">
                            <b style="color: #f59e0b;">Claim A:</b><br/>
                            {c.get('claim_a')}
                        </div>
                        <div class="claim-box-b">
                            <b style="color: #ef4444;">Claim B:</b><br/>
                            {c.get('claim_b')}
                        </div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

    # 3. STRUCTURED SUMMARY TAB
    with tabs[2]:
        st.markdown("### Structured Summary with Source Traceability")
        st.caption("Consolidated factual statements supported by ingested sources.")
        summary = data.get("structured_summary", [])
        if not summary:
            st.info("No summarized facts extracted.")
        else:
            for item in summary:
                pills = "".join([f'<span class="source-pill">📌 {s}</span>' for s in item.get("sources", [])])
                st.markdown(f"""
                <div class="evidence-card">
                    <div style="font-size: 1rem; color: #cdd6f4; font-weight: 500; margin-bottom: 8px;">
                        {item.get('fact')}
                    </div>
                    <div>{pills}</div>
                </div>
                """, unsafe_allow_html=True)

    # 4. OUTDATED WARNINGS TAB
    with tabs[3]:
        st.markdown("### Temporal & Outdated Warnings")
        st.caption("Mentions of past cycles, deadlined dates, or obsolete years.")
        warnings = data.get("outdated_warnings", [])
        if not warnings:
            st.success("No outdated dates or obsolete cycle references flagged.")
        else:
            for w in warnings:
                st.markdown(f"""
                <div class="evidence-card" style="border-left: 4px solid #f38ba8;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-weight: 700; color: #f38ba8;">⚠️ Stale / Expired Context</span>
                        <span class="source-pill">📍 {w.get('source')}</span>
                    </div>
                    <div style="color: #cdd6f4; font-size: 0.95rem;">
                        {w.get('warning')}
                    </div>
                </div>
                """, unsafe_allow_html=True)

    # 5. VERIFICATION CHECKLIST TAB
    with tabs[4]:
        st.markdown("### Prioritized Verification Checklist")
        st.caption("Actionable steps sorted by importance to resolve discrepancies.")
        checklist = data.get("verification_checklist", [])
        for item in sorted(checklist, key=lambda x: x.get("priority", 99)):
            col_check, col_act = st.columns([0.08, 0.92])
            with col_check:
                st.checkbox("", key=f"check_{item.get('priority')}_{item.get('action')[:10]}")
            with col_act:
                st.markdown(f"""
                <div style="display: flex; align-items: center; padding: 6px 0;">
                    <span class="priority-badge">#{item.get('priority')}</span>
                    <span style="font-size: 1rem; color: #cdd6f4; font-weight: 500;">{item.get('action')}</span>
                </div>
                """, unsafe_allow_html=True)

    # 6. RAW JSON TAB
    with tabs[5]:
        st.markdown("### Strict Schema JSON Payload")
        st.caption("Conforms strictly to backend schema")
        st.json(data)
        st.download_button(
            "⬇️ Download JSON Blueprint",
            data=json.dumps(data, indent=2),
            file_name="gap_engine_analysis.json",
            mime="application/json"
        )

    # Ingested Source Inspector
    with st.expander("🔍 Ingested Sources Inspector", expanded=False):
        for s in sources:
            st.markdown(f"**{s['id']}**: *{s['name']}* (`{s.get('type', 'DOC')}`)")
            st.caption(f"Origin: {s['origin']}")
            st.text_area(f"Payload ({s['id']})", value=s['content'][:1500] + ("..." if len(s['content']) > 1500 else ""), height=100, disabled=True)
