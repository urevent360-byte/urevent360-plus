// src/app/admin/crm/[leadId]/page.tsx

type Props = {
  params: { leadId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function AdminLeadDetailPage({ params }: Props) {
  const { leadId } = params;
  // TODO: add the rest of the page logic here
  return (
    <div>
      <h1>Lead Detail Page</h1>
      <p>Lead ID: {leadId}</p>
    </div>
  );
}
