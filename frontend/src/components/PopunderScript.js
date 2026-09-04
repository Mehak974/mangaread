"use client";

import { useEffect } from "react";

export default function PopunderScript() {
  useEffect(() => {
    const jmwxc = {};
    const d = document;
    const s = d.createElement("script");
    const l = d.scripts[d.scripts.length - 1];
    s.settings = jmwxc;
    s.src = "//smooth-survey.com/c.Du9t6_bT2h5/lfSOWpQQ9QN/zxM/3/OGT/kw1TMtyu0z3OMpzzco5/OqT/Ud3m";
    s.async = true;
    s.referrerPolicy = "no-referrer-when-downgrade";
    l.parentNode.insertBefore(s, l);
  }, []);

  return null;
}
