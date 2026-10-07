import { getSettings } from "@/services/settings";
import { requireSession } from "@/lib/auth";
import { SettingsEditor } from "@/components/admin/settings-editor";
export default async function Settings() {
    const session = await requireSession();
    if (session.user.role.name !== "OWNER")
        return <div className="empty-state"><h1>Owner access required.</h1></div>;
    return <SettingsEditor settings={await getSettings()} csrf={session.csrfToken}/>;
}
