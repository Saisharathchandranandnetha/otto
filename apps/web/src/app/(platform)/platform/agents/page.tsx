import { Sidebar } from '../../../../components/Sidebar';

export default function AgentsPage() {
  return (
    <div className="flex h-screen bg-[#f4f7f6]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-display-sm font-semibold mb-6">Agents</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          Manage your AI agents here.
        </p>
      </main>
    </div>
  );
}
