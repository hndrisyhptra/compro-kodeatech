"use client";
import { useState } from "react";
import { Plus, Save, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { Notice } from "./notice";
import { Confirm } from "./confirm";
interface UserRow {
    id: string;
    name: string;
    email: string;
    active: boolean;
    role: {
        name: string;
    };
}
const empty = { name: "", email: "", password: "", role: "EDITOR", active: true };
export function UsersEditor({ items, csrf }: {
    items: UserRow[];
    csrf: string;
}) {
    const [selected, setSelected] = useState<string | null>(null), [show, setShow] = useState(false), [data, setData] = useState(empty), [pending, setPending] = useState<string | null>(null), { request, busy, notice } = useAdmin(csrf);
    return <><div className="admin-page-heading"><div><span className="eyebrow">THE RIGHT ACCESS FOR YOUR TEAM</span><h1>Users & roles</h1><p>Owners manage everything. Editors manage content. Viewers have read-only access.</p></div><button className="button" onClick={() => { setSelected(null); setData(empty); setShow(true); }}><Plus size={16}/>Add user</button></div><div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Team member</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(u => <tr key={u.id}><td><strong>{u.name}</strong><small>{u.email}</small></td><td><span className="badge"><ShieldCheck size={12}/>{u.role.name}</span></td><td><span className={`badge ${u.active ? "published" : "draft"}`}>{u.active ? "Active" : "Inactive"}</span></td><td><div className="row-actions"><button className="icon-button" aria-label={`Edit ${u.name}`} onClick={() => { setSelected(u.id); setData({ name: u.name, email: u.email, password: "", role: u.role.name, active: u.active }); setShow(true); }}><Pencil size={16}/></button><button className="icon-button" aria-label={`Delete ${u.name}`} onClick={() => setPending(u.id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>{show && <form className="admin-panel user-editor" onSubmit={async (e) => {
                e.preventDefault();
                const result = await request("/api/admin/users", { id: selected || undefined, record: data });
                if (result)
                    setShow(false);
            }}><h2>{selected ? "Edit team member" : "Add team member"}</h2><div className="form-grid"><label>Name<input required minLength={2} value={data.name} onChange={e => setData({ ...data, name: e.target.value })}/></label><label>Email<input type="email" required value={data.email} onChange={e => setData({ ...data, email: e.target.value })}/></label><label>{selected ? "New password (leave blank to keep)" : "Password"}<input type="password" required={!selected} minLength={12} autoComplete="new-password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })}/></label><label>Role<select value={data.role} onChange={e => setData({ ...data, role: e.target.value })}>{["OWNER", "EDITOR", "VIEWER"].map(r => <option key={r}>{r}</option>)}</select></label></div><label className="checkbox-label"><input type="checkbox" checked={data.active} onChange={e => setData({ ...data, active: e.target.checked })}/>Active account</label><div className="editor-header-actions"><button className="button" disabled={busy}><Save size={16}/>Save user</button><button className="button secondary" type="button" onClick={() => setShow(false)}>Cancel</button></div></form>}<Notice notice={notice}/><Confirm open={!!pending} title="Remove this team member?" description="Their access will be revoked. Published content will be preserved." onCancel={() => setPending(null)} onConfirm={() => request("/api/admin/users", { id: pending }, "DELETE")}/></>;
}
