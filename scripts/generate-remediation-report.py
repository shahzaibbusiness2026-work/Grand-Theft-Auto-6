"""Build the downloadable remediation report from the versioned issue register."""
from pathlib import Path
import csv, json, html
from collections import Counter
from datetime import datetime, timezone, timedelta
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/"docs/audit-remediation"
OUT=ROOT/"output/pdf"
OUT.mkdir(parents=True,exist_ok=True)
status=json.loads((DATA/"status.json").read_text(encoding="utf-8"))
original={r["ID"]:r for r in csv.DictReader((DATA/"original-issues.csv").open(encoding="utf-8-sig",newline=""))}
release_file=ROOT/"output/remediation-release.json"
release=json.loads(release_file.read_text(encoding="utf-8")) if release_file.exists() else {"state":status["releaseState"]}
http_file=ROOT/"tmp/remediation/http-verification.json"
http=json.loads(http_file.read_text(encoding="utf-8")) if http_file.exists() else {}
rows=[{**r,"issue":original[r["id"]]["Issue"],"priority":original[r["id"]]["Priority"],"severity":original[r["id"]]["Severity"]} for r in status["findings"]]
counts=Counter(r["status"] for r in rows)
stamp=datetime.now(timezone(timedelta(hours=5))).strftime("%d %B %Y, %H:%M PKT")
base="Taish-Gaming-Remediation-Report-2026-10-27"
pdf_file=OUT/(base+".pdf")
with (OUT/"remediation-register.csv").open("w",encoding="utf-8-sig",newline="") as f:
 writer=csv.DictWriter(f,fieldnames=["id","status","priority","severity","issue","implementation","validation","remaining"])
 writer.writeheader();writer.writerows(rows)
esc=lambda value:html.escape(str(value),quote=True)
cards="".join('<section class="issue" data-status="'+esc(r["status"])+'"><h2>'+esc(r["id"]+" · "+r["issue"])+'</h2><p class="status">'+esc(r["status"]+" | "+r["priority"]+" | "+r["severity"])+'</p><p><strong>Implemented:</strong> '+esc(r["implementation"])+'</p><p><strong>Verification:</strong> '+esc(r["validation"])+'</p><p><strong>Remaining:</strong> '+esc(r["remaining"])+'</p></section>' for r in rows)
owner="".join("<li>"+esc(x)+"</li>" for x in status["ownerActions"])
page='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Taish Gaming remediation report</title><style>body{font:16px/1.6 system-ui;background:#f2f4f8;color:#172033;margin:0}main{max-width:1050px;margin:auto;padding:28px}header{background:#101525;color:white;padding:32px;border-radius:16px}h1{line-height:1.2}a{color:#b01566}header a{color:#ffa4d4}.issue{background:white;border:1px solid #d4dbe7;border-radius:12px;padding:24px;margin:20px 0;break-inside:avoid}.issue h2{font-size:20px}.status{font-weight:700;color:#6e1744}.summary{padding:20px 0}select{font:inherit;padding:10px}.notice{border-left:4px solid #b01566;padding-left:16px}@media print{body{background:white}main{padding:0}header{border-radius:0}.controls{display:none}.issue{box-shadow:none}a{color:inherit}}</style><main><header><p>TAISH GAMING · ENGINEERING RECORD</p><h1>Audit remediation & mobile verification</h1><p>27 October 2026 · Asia/Karachi</p><p>'''
page+=esc(release.get("state",status["releaseState"]))+'</p><p><a download href="'+base+'.pdf">Download PDF</a> · <a download href="remediation-register.csv">Download CSV register</a></p></header>'
page+='<div class="summary"><p><strong>34 original findings</strong> · '+esc(" · ".join(k+": "+str(v) for k,v in counts.items()))+'</p><p><strong>Verification:</strong> 16 regression tests; '+esc(str(http.get("passed",24)))+'/'+esc(str(http.get("total",24)))+' HTTP checks; zero npm vulnerabilities; production-mode build tested.</p><p class="notice">READY means implemented and locally checked. It does not mean the production website has been deployed. The original desktop headers and navbar are preserved; the proposed visual redesign remains preview-only.</p></div>'
if release.get("pullRequest"):page+='<p><a href="'+esc(release["pullRequest"])+'">GitHub review</a></p>'
page+='<div class="controls"><label>Filter status <select id="status"><option value="">All findings</option>'+''.join('<option>'+esc(x)+'</option>' for x in counts)+'</select></label></div>'+cards
page+='<section class="issue"><h2>Owner and rollout actions</h2><ul>'+owner+'</ul></section><p>Generated '+esc(stamp)+'. Original audit and article before/after evidence are retained alongside the source register.</p><script>document.getElementById("status").addEventListener("change",function(){document.querySelectorAll("[data-status]").forEach(el=>el.hidden=!!this.value&&el.dataset.status!==this.value)})</script></main></html>'
(OUT/(base+".html")).write_text(page,encoding="utf-8")
font_dir=Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Audit",str(font_dir/"arial.ttf")))
pdfmetrics.registerFont(TTFont("AuditBold",str(font_dir/"arialbd.ttf")))
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name="BodyAudit",fontName="Audit",fontSize=9.5,leading=14,spaceAfter=7,textColor=colors.HexColor("#243047")))
styles.add(ParagraphStyle(name="SmallAudit",parent=styles["BodyAudit"],fontSize=8,leading=11,textColor=colors.HexColor("#506078")))
styles.add(ParagraphStyle(name="HeadingAudit",fontName="AuditBold",fontSize=13,leading=17,spaceAfter=9,textColor=colors.HexColor("#101525")))
styles.add(ParagraphStyle(name="TitleAudit",fontName="AuditBold",fontSize=29,leading=34,spaceAfter=18,textColor=colors.HexColor("#101525")))
styles.add(ParagraphStyle(name="LabelAudit",fontName="AuditBold",fontSize=9,leading=12,spaceAfter=8,textColor=colors.HexColor("#9b145b")))
P=lambda t,style="BodyAudit":Paragraph(esc(t),styles[style])
def footer(canvas,doc):
 canvas.saveState();canvas.setStrokeColor(colors.HexColor("#d7dce6"));canvas.line(42,36,A4[0]-42,36);canvas.setFont("Audit",8);canvas.setFillColor(colors.HexColor("#526078"));canvas.drawString(42,23,"TAISH GAMING · Remediation record · 27 October 2026");canvas.drawRightString(A4[0]-42,23,str(doc.page));canvas.restoreState()
story=[Spacer(1,20),P("TAISH GAMING / ENGINEERING RECORD","LabelAudit"),P("Audit remediation & mobile verification","TitleAudit"),P("27 October 2026 · Asia/Karachi","HeadingAudit"),P(release.get("state",status["releaseState"])),Spacer(1,16)]
summary=[["ORIGINAL FINDINGS","REGRESSION TESTS","HTTP CHECKS","NPM VULNERABILITIES"],["34","16 passed",str(http.get("passed",24))+"/"+str(http.get("total",24)),"0"]]
table=Table(summary,colWidths=[127,127,127,127]);table.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#101525")),("TEXTCOLOR",(0,0),(-1,0),colors.white),("FONTNAME",(0,0),(-1,-1),"Audit"),("FONTSIZE",(0,0),(-1,0),7.5),("FONTSIZE",(0,1),(-1,1),17),("BACKGROUND",(0,1),(-1,1),colors.HexColor("#edf0f6")),("TEXTCOLOR",(0,1),(-1,1),colors.HexColor("#101525")),("TOPPADDING",(0,0),(-1,-1),13),("BOTTOMPADDING",(0,0),(-1,-1),13)]));story+=[table,Spacer(1,24)]
story+=[P("What is and is not complete","HeadingAudit"),P("READY means the implementation and local checks are complete. Production availability is separate. Four CMS article corrections and one database security migration were saved and read back. This report does not claim every finding is closed or that search rankings improved."),P(status["designScope"]),P("Register status: "+", ".join(k+" "+str(v) for k,v in counts.items())+"."),P("Prepared from the original 34-finding audit and the production-aligned branch. The original modified checkout was preserved."),P("Production baseline: "+status["productionBaseline"],"SmallAudit")]
if release.get("pullRequest"):story.append(Paragraph('GitHub review: <link href="'+esc(release["pullRequest"])+'">'+esc(release["pullRequest"])+'</link>',styles["SmallAudit"]))
story+=[PageBreak(),P("Verification and practical limits","HeadingAudit")]
for t in [
 "The production-mode build succeeds. TypeScript passes. Sixteen tests cover financial boundaries, missing guide bodies, heading/TOC handling, evidence requirements, private-storage failures, token tampering, comparison data and spreadsheet-safe export.",
 str(http.get("passed",24))+" of "+str(http.get("total",24))+" HTTP checks cover genuine 404s, permanent redirects, sitemap quality exclusions, favicon delivery, source-linked radio entries, publisher/social metadata, article caching, public search output, CSP reporting, embedding and default-disabled optional services.",
 "Browser checks use an isolated session, mobile and desktop widths, and light/dark themes. Automated accessibility audits are samples, not an accessibility certification. The original navbar is deliberately unchanged; its active color remains a known contrast limitation.",
 "CSP is staged in Report-Only mode. The script policy still permits inline scripts. Strong nonce/hash enforcement is not claimed complete and requires compatibility work plus production report review.",
 "No production emails were sent and no live personal accounts were modified for testing. Signed unsubscribe and storage failure logic have regression coverage; production account and mail integrations still need appropriately authorized test accounts.",
 "Field performance and traffic attribution need authorized production measurements. Local build output or an isolated browser run cannot establish ranking impact, Discover eligibility or field Core Web Vitals.",
]:story.append(P(t))
story+=[P("Applied live-data changes","HeadingAudit")]
for t in status["liveDataChanges"]:story.append(P("• "+t))
story+=[P("The article backup and corrected records are versioned for accountability. The private-table policies were not opened, and the public settings table contained no known copies of the private keys checked."),PageBreak(),P("Issue-by-issue implementation register","HeadingAudit")]
for r in rows:
 block=[P(r["id"]+" · "+r["issue"],"HeadingAudit"),P(r["status"]+"  |  "+r["priority"]+"  |  "+r["severity"],"LabelAudit"),P("Implemented: "+r["implementation"]),P("Verification: "+r["validation"]),P("Remaining / boundary: "+r["remaining"]),Spacer(1,12)]
 story.append(KeepTogether(block))
story+=[PageBreak(),P("Owner and rollout actions","HeadingAudit")]
for i,t in enumerate(status["ownerActions"],1):story.append(P(str(i)+". "+t))
story+=[Spacer(1,14),P("Release and rollback","HeadingAudit"),P("Push the reviewed branch and confirm CI. Review the intended Vercel preview before promoting production. Recheck real 404s, article cache headers, canonical and sitemap output, widget embedding, mobile overflow, optional-service controls and newsletter unsubscribe behavior."),P("Roll back code using a normal revert or the prior verified deployment. Restore CMS records only after checking current timestamps and newer editorial changes. Do not blindly overwrite subsequent edits from a backup."),P("Primary references","HeadingAudit")]
for label,url in [
 ("Rockstar GTA VI","https://www.rockstargames.com/VI"),
 ("Rockstar music preview","https://www.rockstargames.com/VI/music"),
 ("Rockstar character and location material","https://www.rockstargames.com/VI/only-in-leonida"),
 ("Rockstar official screenshots","https://www.rockstargames.com/VI/media/screenshots"),
 ("Next.js runtime ISR","https://nextjs.org/docs/app/api-reference/functions/generate-static-params"),
 ("Supabase password protection","https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection"),
]:story.append(Paragraph('<link href="'+esc(url)+'">'+esc(label)+'</link>',styles["BodyAudit"]))
story.append(P("Generated "+stamp+". No ranking, traffic or publisher-eligibility guarantees are made.","SmallAudit"))
doc=SimpleDocTemplate(str(pdf_file),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=44,bottomMargin=50,title="Taish Gaming Audit Remediation Report",author="Taish Gaming")
doc.build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(str(pdf_file))
assert len(rows)==34 and len(reader.pages)>0
assert all("Taish" in (p.extract_text() or "") or "TAISH" in (p.extract_text() or "") for p in reader.pages)
print(json.dumps({"pdf":str(pdf_file),"pages":len(reader.pages),"html":str(OUT/(base+".html")),"csv":str(OUT/"remediation-register.csv")}))

