export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    scope: string;
    agencyId: number | null;
    permissions: string[];
  };
}
