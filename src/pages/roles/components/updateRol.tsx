"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";

import { errorToast, successToast } from "@/lib/core.function";
import { Skeleton } from "@/components/ui/skeleton";
import { updateRol } from "../lib/rol.actions";
import { useRolStore } from "../lib/rol.store";
import { useState } from "react";
import { RolItem } from "../lib/rol.interface";

const RolSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio"),
});

interface UpdateRolProps {
  onClose: () => void;
  rol: RolItem;
}

export default function UpdateRolPage({ onClose, rol }: UpdateRolProps) {
  const form = useForm<z.infer<typeof RolSchema>>({
    resolver: zodResolver(RolSchema),
    defaultValues: {
      name: rol.name,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading } = useRolStore();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = form.getValues();
      await updateRol(rol.id, data);
      successToast("Rol guardado correctamente");
      onClose();
    } catch (error) {
      errorToast("Ocurrió un error al guardar el rol");
    } finally {
      setIsSubmitting(false);
    }
    onClose();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 bg-white">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>
    );
  }

  return (
    <div className="bg-white p-5 ">
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={handleFormSubmit}>
            {/* Campos del formulario */}
            <div className="flex flex-col gap-4">
              <div className="w-full rounded-lg bg-secondary p-4 text-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal font-poopins">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
                          placeholder="Usuario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Botones en la parte inferior */}
            <div className="mt-6 flex justify-end gap-2">
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="bg-black text-white font-inter hover:bg-black/95 hover:text-white text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-[#818cf8] hover:bg-[#6366f1] ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
