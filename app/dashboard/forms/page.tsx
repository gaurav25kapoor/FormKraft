import { getForms } from "@/actions/getForms";
import CreateFormDialog from "@/components/CreateFormDialog";
import FormList from "@/components/FormList";
 

const MyForm = async () => {
  const forms = await getForms();

  return (
    <div>
      <section className="flex items-center justify-between max-w-7xl mx-auto mb-4">
        <h1 className="font-bold text-xl">My Forms</h1>
        <CreateFormDialog />
      </section>

      <div className="grid grid-cols-3 gap-10">
        {forms.data?.map((form: any, index: number) => (
          <FormList key={form.id || index} form={form} />
        ))}
      </div>
    </div>
  );
};

export default MyForm;
