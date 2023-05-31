import { Lead } from "../../types";

interface ILeadDatabase {
  getLead(telefone: string): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  insertLead(lead: Lead): Promise<void>;
  deleteLead(telefone: string): Promise<void>;
}
