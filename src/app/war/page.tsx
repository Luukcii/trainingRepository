// "/war" sends visitors straight to the player's guide.
import { redirect } from "next/navigation";

export default function WarPage() {
  redirect("/war/rules");
}
