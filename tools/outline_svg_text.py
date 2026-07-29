"""Turn <text> in an SVG into outlined paths using a supplied font file."""
import re, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

class Outliner:
    def __init__(self, regular, bold=None):
        self.f = {"normal": TTFont(regular)}
        if bold: self.f["bold"] = TTFont(bold)
        self.cache = {}

    def _glyphset(self, weight):
        font = self.f.get(weight, self.f["normal"])
        return font, font.getGlyphSet(), font["cmap"].getBestCmap(), font["hmtx"], font["head"].unitsPerEm

    def path_for(self, s, size, x, y, weight="normal", anchor="start"):
        font, gs, cmap, hmtx, upem = self._glyphset(weight)
        scale = size / upem
        # measure
        width = 0
        for ch in s:
            gname = cmap.get(ord(ch))
            if gname is None: continue
            width += hmtx[gname][0]
        width *= scale
        if anchor == "middle": x -= width / 2
        elif anchor == "end":  x -= width
        d, cursor = [], 0
        for ch in s:
            gname = cmap.get(ord(ch))
            if gname is None: continue
            pen = SVGPathPen(gs)
            gs[gname].draw(pen)
            seg = pen.getCommands()
            if seg:
                d.append('<path d="%s" transform="translate(%.2f %.2f) scale(%.5f %.5f)"/>'
                         % (seg, x + cursor, y, scale, -scale))
            cursor += hmtx[gname][0] * scale
        return "".join(d), width

def convert(svg, outliner):
    def repl(m):
        attrs, inner = m.group(1), m.group(2)
        if "<" in inner: return m.group(0)          # leave tspan-bearing text alone
        get = lambda k, d=None: (re.search(k + r'\s*=\s*"([^"]*)"', attrs) or [None, d])[1]
        try:
            x = float(get("x", "0")); y = float(get("y", "0"))
        except (TypeError, ValueError):
            return m.group(0)
        size = float(get("font-size", "16") or 16)
        fill = get("fill", "#000000") or "#000000"
        anchor = get("text-anchor", "start") or "start"
        weight = "bold" if (get("font-weight", "") or "").lower() in ("bold", "700", "800", "900") else "normal"
        text = re.sub(r"\s+", " ", inner).strip()
        if not text: return m.group(0)
        d, _ = outliner.path_for(text, size, x, y, weight, anchor)
        return '<g fill="%s">%s</g>' % (fill, d)
    return re.sub(r"<text([^>]*)>(.*?)</text>", repl, svg, flags=re.S)

if __name__ == "__main__":
    src, dst, reg = sys.argv[1], sys.argv[2], sys.argv[3]
    bold = sys.argv[4] if len(sys.argv) > 4 else None
    o = Outliner(reg, bold)
    open(dst, "w").write(convert(open(src).read(), o))
    print("written:", dst)
