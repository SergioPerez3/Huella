import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import DeleteAccountDialog from "../components/DeleteAccountDialog.jsx";
import Avatar from "../components/Avatar.jsx";
import PresetAvatar from "../components/PresetAvatar.jsx";
import { avatarPresets } from "../utils/avatars.js";
import { FiAlertTriangle, FiSettings } from "react-icons/fi";
import PageHeader from "../components/PageHeader.jsx";

const Settings = () => {
  const { user, updateProfile, removeAccount, uploadAvatar, removeAvatar } =
    useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInput = useRef(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const runAvatar = async (action) => {
    setAvatarError("");
    setAvatarBusy(true);
    try {
      await action();
    } catch (err) {
      setAvatarError(err.message);
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return setAvatarError("La imagen no puede superar 5 MB");
    const formData = new FormData();
    formData.append("photo", file);
    runAvatar(() => uploadAvatar(formData));
  };
  const handleChange = (e) => {
    setName(e.target.value);
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (password) => {
    await removeAccount(password);
    navigate("/login");
  };

  return (
    <section>
      <PageHeader
        icon={FiSettings}
        title="Configuración"
        subtitle="Tu perfil y tu cuenta"
      />

      <div className="settings-stack">
        <section className="card">
          <div className="profile-head">
            <Avatar user={user} large />
            <div>
              <h2>Mi perfil</h2>
              <p className="muted">Así apareces en Huella.</p>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="profile-name">Nombre</label>
              <input
                id="profile-name"
                value={name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="profile-email">Email</label>
              <input id="profile-email" value={user?.email || ""} disabled />
            </div>
            {error && <p role="alert">{error}</p>}
            {saved && (
              <p role="status" className="form-success">
                Cambios guardados
              </p>
            )}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !name.trim() || name.trim() === user?.name}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <h2>Foto de perfil</h2>
          <p className="muted">Elige un avatar o sube tu propia foto.</p>

          <div className="avatar-grid" role="group" aria-label="Avatares">
            {avatarPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`avatar-option ${user?.avatar?.preset === preset.id ? "is-selected" : ""}`}
                aria-pressed={user?.avatar?.preset === preset.id}
                aria-label={`Avatar ${preset.id}`}
                disabled={avatarBusy}
                onClick={() =>
                  runAvatar(() => updateProfile({ avatarPreset: preset.id }))
                }
              >
                <PresetAvatar id={preset.id} />
              </button>
            ))}
          </div>

          <div className="avatar-actions">
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleFile}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={avatarBusy}
              onClick={() => fileInput.current.click()}
            >
              {avatarBusy ? "Guardando..." : "Subir mi foto"}
            </button>
            {(user?.avatar?.url || user?.avatar?.preset) && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={avatarBusy}
                onClick={() => runAvatar(removeAvatar)}
              >
                Quitar avatar
              </button>
            )}
          </div>
          {avatarError && <p role="alert">{avatarError}</p>}
        </section>

        <section className="card danger-zone">
          <h2>
            <FiAlertTriangle aria-hidden="true" /> Zona de peligro
          </h2>
          <p className="muted">
            Eliminar tu cuenta borra definitivamente tus mascotas, su historial
            de salud, tareas, gastos y archivos.
          </p>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setDialogOpen(true)}
          >
            Eliminar mi cuenta
          </button>
        </section>
      </div>

      <DeleteAccountDialog
        open={dialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </section>
  );
};

export default Settings;
