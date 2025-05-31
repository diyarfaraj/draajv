import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm format

// Grundschema utan refines för att kunna referera till dess typ i refine
const baseDriveEntrySchema = z.object({
  date: z.string().min(1, { message: "Datum är obligatoriskt." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum måste vara i formatet YYYY-MM-DD."),
  startTime: z.string().regex(timeRegex, "Starttid måste vara i formatet HH:MM."),
  endTime: z.string().regex(timeRegex, "Sluttid måste vara i formatet HH:MM."),
  startOdometer: z.coerce.number({invalid_type_error: "Startmätarställning måste vara ett tal."})
    .positive({ message: "Startmätarställning måste vara positiv." })
    .finite(),
  endOdometer: z.coerce.number({invalid_type_error: "Slutmätarställning måste vara ett tal."})
    .positive({ message: "Slutmätarställning måste vara positiv." })
    .finite(),
  purpose: z.string().min(1, { message: "Syfte är obligatoriskt." }).max(100, "Syfte får max vara 100 tecken."),
  location: z.string().min(1, { message: "Ort är obligatoriskt." }).max(100, "Ort får max vara 100 tecken."),
  vehicleType: z.string().min(1, { message: "Fordonstyp är obligatoriskt." }).max(100, "Fordonstyp får max vara 100 tecken."),
});

export const driveEntrySchema = baseDriveEntrySchema.refine((data: z.infer<typeof baseDriveEntrySchema>) => {
  return data.endOdometer >= data.startOdometer;
}, {
  message: "Slutmätarställning får inte vara mindre än startmätarställning.",
  path: ["endOdometer"], 
}).refine((data: z.infer<typeof baseDriveEntrySchema>) => {
    if (data.startTime && data.endTime) {
        const [startH, startM] = data.startTime.split(':').map(Number);
        const [endH, endM] = data.endTime.split(':').map(Number);
        if (endH < startH) return false;
        if (endH === startH && endM <= startM) return false;
    }
    return true;
}, {
    message: "Sluttid måste vara efter starttid.",
    path: ["endTime"],
});

export type DriveEntrySchemaType = z.infer<typeof driveEntrySchema>; 