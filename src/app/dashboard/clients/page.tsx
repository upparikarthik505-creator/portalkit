import { redirect } from "next/navigation";

/** Legacy route — people live under /dashboard/contacts. */
export default function ClientsRedirect() {
  redirect("/dashboard/contacts");
}
