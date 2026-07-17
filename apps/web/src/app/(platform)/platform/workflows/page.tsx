import { Sidebar } from '../../../../components/Sidebar';
import { WorkflowCanvas } from '../../../../components/workflows/WorkflowCanvas';

export default function WorkflowsPage() {
  return (
    <div className="flex h-screen bg-[#f4f7f6]">
      <Sidebar />
      <main className="flex-1 p-8 h-full flex flex-col overflow-hidden">
        <h1 className="text-display-sm font-semibold mb-6 flex-shrink-0">Workflows</h1>
        <div className="flex-1 w-full relative">
          <WorkflowCanvas />
        </div>
      </main>
    </div>
  );
}
