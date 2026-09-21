export type MasterRecord = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMasterConfigOptions = {
  title: string;
  description: string;
  nameLabel: string;
  searchPlaceholder: string;
  records: MasterRecord[];
};
