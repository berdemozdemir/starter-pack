export type ExampleItem = {
  id: string;
  title: string;
  notes: string | undefined;
  createdAt: Date;
};

export type ExampleAdminItem = ExampleItem & {
  ownerName: string;
  ownerEmail: string;
};
