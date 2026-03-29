import { buildShortBio } from "./entities";
import { summarizeText } from "./geo";

export const formatDatePtBR = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  },
) => new Intl.DateTimeFormat("pt-BR", options).format(date);

export const buildPersonSummary = (person: {
  resumoCurto?: string;
  bio: string;
}) => person.resumoCurto ?? buildShortBio(person.bio);

export const buildProjectSummary = (project: {
  resumoCurto?: string;
  resumo: string;
}) => project.resumoCurto ?? summarizeText(project.resumo, 180);

export const buildEventSummary = (event: {
  resumoCurto?: string;
  descricao: string;
}) => event.resumoCurto ?? summarizeText(event.descricao, 180);

export const getEventAttendanceMode = (mode?: string) => {
  if (mode === "Online") {
    return "https://schema.org/OnlineEventAttendanceMode";
  }

  if (mode === "Híbrido") {
    return "https://schema.org/MixedEventAttendanceMode";
  }

  return "https://schema.org/OfflineEventAttendanceMode";
};

export const getEventStatus = (startDate: Date, endDate?: Date) => {
  const now = new Date();
  const normalizedEndDate = endDate ?? startDate;

  if (normalizedEndDate.getTime() < now.getTime()) {
    return "https://schema.org/EventCompleted";
  }

  return "https://schema.org/EventScheduled";
};
