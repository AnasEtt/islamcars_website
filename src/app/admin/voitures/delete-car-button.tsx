"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { deleteCarAction } from "./actions";

type DeleteCarButtonProps = {
  carId: string;
  carLabel: string;
  slug: string;
  fullWidth?: boolean;
};

export function DeleteCarButton({
  carId,
  carLabel,
  slug,
  fullWidth = false,
}: DeleteCarButtonProps) {
  return (
    <form
      action={deleteCarAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Supprimer ${carLabel} ? Cette action est definitive.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={carId} />
      <input name="slug" type="hidden" value={slug} />
      <SubmitButton fullWidth={fullWidth} />
    </form>
  );
}

function SubmitButton({ fullWidth }: { fullWidth: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 ${
        fullWidth ? "w-full" : ""
      }`}
      disabled={pending}
      type="submit"
    >
      <Trash2 size={15} />
      {pending ? "Suppression..." : "Supprimer"}
    </button>
  );
}
