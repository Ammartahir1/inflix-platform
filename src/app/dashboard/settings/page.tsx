import { Topbar } from '@/components/platform/Topbar'

export default function SettingsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar title="Settings" subtitle="Platform configuration" />

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 max-w-xl">
        <div className="card p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Platform</p>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <p className="text-sm font-medium">Base Domain</p>
              <p className="text-xs text-white/40 mt-0.5">Tenant stores are served under this domain</p>
            </div>
            <span className="font-mono text-xs text-gold bg-gold/10 px-3 py-1 rounded-lg">
              inflix.uk
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <p className="text-sm font-medium">API</p>
              <p className="text-xs text-white/40 mt-0.5">Backend service endpoint</p>
            </div>
            <span className="font-mono text-xs text-white/50 bg-white/5 px-3 py-1 rounded-lg">
              api.inflix.uk
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Platform Portal</p>
              <p className="text-xs text-white/40 mt-0.5">This app</p>
            </div>
            <span className="font-mono text-xs text-white/50 bg-white/5 px-3 py-1 rounded-lg">
              platform.inflix.uk
            </span>
          </div>
        </div>

        <div className="card p-4 border-white/5">
          <p className="text-xs text-white/30 leading-relaxed">
            Full settings management (SMTP configuration, default plan limits, webhook endpoints) will be available in Phase 3.
          </p>
        </div>
      </div>
    </div>
  )
}
