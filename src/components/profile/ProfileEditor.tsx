"use client"; // needs the browser: the preview card changes as you click options

import { useActionState, useState } from "react";
import { saveProfileAction } from "@/app/profile/actions";
import { banners, emblemColors, emblems, type BannerKey, type ColorKey, type EmblemKey, type PlayerCardLook } from "@/content/player-card";
import { PlayerCard } from "./PlayerCard";
import { Emblem } from "./Emblem";
import { PictureUpload } from "./PictureUpload";

type ProfileEditorProps = { name: string; initial: { callsign: string; bio: string; look: PlayerCardLook } };

export function ProfileEditor({ name, initial }: ProfileEditorProps) {
  const [look, setLook] = useState(initial.look);
  const [callsign, setCallsign] = useState(initial.callsign);
  const [state, save, pending] = useActionState(saveProfileAction, null);
  // Uploaded pictures come from the server (fresh after each upload); the presets come from what you click.
  const { emblemImage, bannerImage } = initial.look;
  const preview = { ...look, emblemImage, bannerImage };

  return (
    <div className="flex flex-col gap-8">
      <PlayerCard name={name} callsign={callsign} look={preview} />

      <div className="grid gap-3 sm:grid-cols-2">
        <PictureUpload kind="emblem" hasPicture={Boolean(emblemImage)} />
        <PictureUpload kind="banner" hasPicture={Boolean(bannerImage)} />
      </div>

      <form action={save} className="flex flex-col gap-8">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Callsign</span>
          <input
            name="callsign"
            value={callsign}
            onChange={(e) => setCallsign(e.target.value)}
            maxLength={24}
            placeholder="e.g. The Iron Wolf"
            className="rounded-md border border-line bg-transparent px-3 py-2"
          />
        </label>

        {(emblemImage || bannerImage) && (
          <p className="text-sm text-muted">Your uploaded picture shows instead of the preset you pick below. Remove it to use the preset.</p>
        )}

        <Picker title="Banner">
          {(Object.keys(banners) as BannerKey[]).map((key) => (
            <Choice key={key} name="banner" value={key} checked={look.banner === key} label={banners[key].label} onPick={() => setLook({ ...look, banner: key })}>
              <span className="block h-10 w-24 rounded" style={{ background: banners[key].background }} />
            </Choice>
          ))}
        </Picker>

        <Picker title="Emblem">
          {(Object.keys(emblems) as EmblemKey[]).map((key) => (
            <Choice key={key} name="emblem" value={key} checked={look.emblem === key} label={emblems[key].label} onPick={() => setLook({ ...look, emblem: key })}>
              <Emblem emblem={key} color={look.color} className="h-10 w-10" />
            </Choice>
          ))}
        </Picker>

        <Picker title="Emblem color">
          {(Object.keys(emblemColors) as ColorKey[]).map((key) => (
            <Choice key={key} name="color" value={key} checked={look.color === key} label={emblemColors[key].label} onPick={() => setLook({ ...look, color: key })}>
              <span className="block h-8 w-8 rounded-full" style={{ background: emblemColors[key].hex }} />
            </Choice>
          ))}
        </Picker>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Bio</span>
          <textarea name="bio" defaultValue={initial.bio} maxLength={280} rows={3} className="rounded-md border border-line bg-transparent px-3 py-2" />
        </label>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={pending} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50">
            {pending ? "Saving…" : "Save card"}
          </button>
          {state && "ok" in state && <p className="text-sm text-green-600">Saved.</p>}
          {state && "error" in state && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
        </div>
      </form>
    </div>
  );
}

function Picker({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

// A radio button dressed up as a tile. The ring shows which one is picked.
function Choice(props: { name: string; value: string; checked: boolean; label: string; onPick: () => void; children: React.ReactNode }) {
  return (
    <label title={props.label} className={`cursor-pointer rounded-md p-1 ring-2 ${props.checked ? "ring-foreground" : "ring-transparent hover:ring-line"}`}>
      <input type="radio" name={props.name} value={props.value} checked={props.checked} onChange={props.onPick} className="sr-only" />
      {props.children}
      <span className="sr-only">{props.label}</span>
    </label>
  );
}
