// NusaStat charts: small SVG line and bar charts drawn from plain arrays.
// No libraries, no network. Every chart labels its axes and its values so a
// reader can check the numbers without hovering.

const NS = "http://www.w3.org/2000/svg";

function el(tag, attrs, text) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function fmt(n) {
  return String(n).replace(".", ",");
}

// Line chart: values over years. Returns an <svg> element.
export function lineChart({ years, values, unit, color = "#0f4c5c", height = 220 }) {
  const W = 640, H = height, padL = 52, padR = 16, padT = 18, padB = 30;
  const min = Math.min(...values, 0);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => padL + (i * (W - padL - padR)) / (values.length - 1);
  const y = (v) => padT + (1 - (v - min) / span) * (H - padT - padB);
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `Grafik garis ${unit}` });

  // gridlines at min, middle, max
  for (const gv of [min, min + span / 2, max]) {
    svg.appendChild(el("line", { x1: padL, x2: W - padR, y1: y(gv), y2: y(gv), stroke: "#e3e8ea", "stroke-width": 1 }));
    svg.appendChild(el("text", { x: padL - 8, y: y(gv) + 4, "text-anchor": "end", "font-size": 12, fill: "#5b6b70" }, fmt(Math.round(gv * 100) / 100)));
  }
  // zero line, when the range crosses zero
  if (min < 0 && max > 0) {
    svg.appendChild(el("line", { x1: padL, x2: W - padR, y1: y(0), y2: y(0), stroke: "#b9c4c7", "stroke-dasharray": "4 3" }));
  }
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  svg.appendChild(el("polyline", { points: pts, fill: "none", stroke: color, "stroke-width": 2.5, "stroke-linejoin": "round", "stroke-linecap": "round" }));
  values.forEach((v, i) => {
    svg.appendChild(el("circle", { cx: x(i), cy: y(v), r: 4, fill: "#fff", stroke: color, "stroke-width": 2 }));
    // Value label above the point, unless the point sits near the top edge
    // (then it would collide with the gridline label): put it below instead.
    const above = y(v) > padT + 16;
    svg.appendChild(el("text", { x: x(i), y: above ? y(v) - 10 : y(v) + 18, "text-anchor": "middle", "font-size": 12, fill: "#16323a", "font-weight": 600 }, fmt(v)));
    svg.appendChild(el("text", { x: x(i), y: H - 8, "text-anchor": "middle", "font-size": 12, fill: "#5b6b70" }, String(years[i])));
  });
  return svg;
}

// Horizontal bar chart: [{label, value}] with values shown at the bar end.
export function barChart({ rows, unit, color = "#0f4c5c", height = 260 }) {
  const W = 640, rowH = Math.max(28, (height - 30) / rows.length);
  const H = rows.length * rowH + 30;
  const max = Math.max(...rows.map((r) => r.value));
  const labelW = 210, padR = 64;
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `Grafik batang ${unit}` });
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const bw = ((W - labelW - padR) * r.value) / max;
    svg.appendChild(el("text", { x: labelW - 10, y: y + rowH / 2 + 4, "text-anchor": "end", "font-size": 12, fill: "#16323a" }, r.label));
    svg.appendChild(el("rect", { x: labelW, y: y + 4, width: Math.max(2, bw), height: rowH - 12, rx: 3, fill: color }));
    svg.appendChild(el("text", { x: labelW + Math.max(2, bw) + 8, y: y + rowH / 2 + 4, "font-size": 12, fill: "#16323a", "font-weight": 600 }, fmt(r.value)));
  });
  svg.appendChild(el("text", { x: labelW, y: H - 6, "font-size": 11, fill: "#5b6b70" }, unit));
  return svg;
}
