export interface ReportDTO {
  id: string;
  summary: string;
  notes: string;
  contentUrl: string;
  evidencesCount: number;
  createdAt: string;
  case: {
    id: string;
    title: string;
    status: string;
    caseDate: string;
    openedAt: string;
    closedAt?: string;
    peritoPrincipal: { id: string; name: string };
    caseParticipants: { id: string; userId: string; user: { id: string; name: string } }[];
  };
}