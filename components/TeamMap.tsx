"use client";

import { limits } from "@/data/config";
import { getType } from "@/data/types";
import { t } from "@/data/locale/en";
import { QUADRANT_IDS, TYPE_IDS, type TypeId } from "@/lib/model";
import { parseShareInput } from "@/lib/share-code";
import { loadTeam, saveTeam, storageAvailable, type TeamMember } from "@/lib/storage";
import { TypeIcon } from "@/components/TypeIcon";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TeamMap() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<TypeId>("director");
  const [paste, setPaste] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [pairA, setPairA] = useState("");
  const [pairB, setPairB] = useState("");
  const [storageOff, setStorageOff] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMembers(loadTeam());
    setStorageOff(!storageAvailable());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!saveTeam(members)) setStorageOff(true);
  }, [members, ready]);

  function add(nextName: string, nextType: TypeId) {
    const clean = nextName.trim().slice(0, 40);
    if (!clean || members.length >= limits.teamMembers) return;
    setMembers((current) => [...current, { id: crypto.randomUUID(), name: clean, type: nextType }]);
    setName("");
    setPaste("");
    setPasteError("");
  }

  function readCode() {
    const parsed = parseShareInput(paste);
    if (!parsed) {
      setPasteError(t.team.pasteBad);
      return;
    }
    setType(parsed.type);
    if (parsed.name) setName(parsed.name);
    setPasteError("");
  }

  const counts = Object.fromEntries(TYPE_IDS.map((id) => [id, members.filter((member) => member.type === id).length])) as Record<TypeId, number>;
  const missing = TYPE_IDS.filter((id) => counts[id] === 0);

  async function exportMap() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f3efe6";
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "#1c1915";
    ctx.font = "600 48px Georgia, serif";
    ctx.fillText("F5 team map", 64, 90);
    QUADRANT_IDS.forEach((id, index) => {
      const x = index % 2 === 0 ? 64 : 560;
      const y = index < 2 ? 160 : 600;
      ctx.strokeStyle = "#1c1915";
      ctx.strokeRect(x, y, 450, 400);
      ctx.font = "600 32px Georgia, serif";
      ctx.fillText(getType(id).label, x + 24, y + 48);
      ctx.font = "28px Georgia, serif";
      members.filter((member) => member.type === id).forEach((member, memberIndex) => {
        ctx.fillText(member.name, x + 24, y + 110 + memberIndex * 40);
      });
    });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "f5-team-map.png";
    link.click();
  }

  const a = members.find((member) => member.id === pairA);
  const b = members.find((member) => member.id === pairB);

  return (
    <main id="main" className="section">
      <div className="wrap" style={{ display: "grid", gap: "1.25rem" }}>
        <div>
          <h1>{t.team.title}</h1>
          <p className="lede">{t.team.intro}</p>
          <p className="fine">{t.team.count(members.length)}</p>
        </div>
        {storageOff ? <p className="notice">{t.team.storage}</p> : null}
        <form
          className="panel"
          style={{ padding: "1rem" }}
          onSubmit={(event) => {
            event.preventDefault();
            add(name, type);
          }}
        >
          <div className="field">
            <label htmlFor="member-name">{t.team.name}</label>
            <input id="member-name" value={name} maxLength={40} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="member-type">{t.team.type}</label>
            <select id="member-type" value={type} onChange={(event) => setType(event.target.value as TypeId)}>
              {TYPE_IDS.map((id) => (
                <option key={id} value={id}>{getType(id).label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="paste">{t.team.paste}</label>
            <input id="paste" value={paste} onChange={(event) => setPaste(event.target.value)} />
          </div>
          {pasteError ? <p role="alert" className="alert">{pasteError}</p> : null}
          <div className="actions">
            <button type="button" className="btn-secondary" onClick={readCode}>{t.team.pasteAction}</button>
            <button className="btn" type="submit" disabled={members.length >= limits.teamMembers || !name.trim()}>{t.team.add}</button>
          </div>
          {members.length >= limits.teamMembers ? <p>{t.team.full}</p> : null}
        </form>
        {members.length === 0 ? <p>{t.team.empty}</p> : null}
        <div className="type-board">
          {QUADRANT_IDS.map((id) => (
            <section key={id} className="type-cell" aria-label={getType(id).label}>
              <span className={`type-mark type-${id}`}>
                <TypeIcon id={id} />
                {getType(id).label}
              </span>
              <span className="fine">{counts[id]}</span>
              <ul>
                {members.filter((member) => member.type === id).map((member) => (
                  <li key={member.id}>
                    {member.name}{" "}
                    <button type="button" className="btn-secondary" onClick={() => setMembers((current) => current.filter((item) => item.id !== member.id))}>
                      {t.team.remove(member.name)}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p>{missing.length ? t.team.missing(missing.map((id) => getType(id).label).join(", ")) : t.team.all}</p>
        {members.length >= 2 ? (
          <div className="panel" style={{ padding: "1rem" }}>
            <h2>{t.team.pair}</h2>
            <div className="field">
              <label htmlFor="pair-a">{t.team.personA}</label>
              <select id="pair-a" value={pairA} onChange={(event) => setPairA(event.target.value)}>
                <option value="">—</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="pair-b">{t.team.personB}</label>
              <select id="pair-b" value={pairB} onChange={(event) => setPairB(event.target.value)}>
                <option value="">—</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            {a && b ? (
              <Link className="btn" href={`/playbook?you=${a.type}&other=${b.type}`}>{t.team.openPair}</Link>
            ) : null}
          </div>
        ) : null}
        <button type="button" className="btn-secondary" onClick={exportMap}>{t.team.export}</button>
      </div>
    </main>
  );
}
