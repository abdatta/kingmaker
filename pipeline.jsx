// pipeline.jsx — Pipeline / Opportunity Feed table.

function Pipeline({ onOpenOpp }) {
  const [filters, setFilters] = React.useState({ status: 'All', agency: 'All', product: 'All', owner: 'All' });
  const [selected, setSelected] = React.useState(new Set());

  const allStatuses = ['All', ...new Set(window.OPPORTUNITIES.map((o) => o.status))];
  const allAgencies = ['All', ...new Set(window.OPPORTUNITIES.map((o) => o.agency))];
  const allProducts = ['All', ...new Set(window.OPPORTUNITIES.map((o) => o.productLine))];
  const allOwners = ['All', ...new Set(window.OPPORTUNITIES.map((o) => o.owner).filter(Boolean))];

  const filtered = window.OPPORTUNITIES.filter((o) =>
    (filters.status === 'All' || o.status === filters.status) &&
    (filters.agency === 'All' || o.agency === filters.agency) &&
    (filters.product === 'All' || o.productLine === filters.product) &&
    (filters.owner === 'All' || o.owner === filters.owner)
  );

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((o) => o.id)));
  };

  const Filter = ({ label, k, options }) => (
    <div className="relative">
      <select value={filters[k]} onChange={(e) => setFilters({ ...filters, [k]: e.target.value })}
        className="appearance-none h-7 pl-2.5 pr-7 bg-slate-900 border border-slate-800 rounded text-[11.5px] text-slate-200 focus:border-cyan-500/50 focus:outline-none">
        {options.map((o) => (
          <option key={o} value={o}>{label}: {o === 'All' && k === 'owner' ? 'All' : o}</option>
        ))}
      </select>
      <Icon.ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
    </div>
  );

  return (
    <div className="px-6 py-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Federal opportunity feed</div>
          <h1 className="text-[22px] font-semibold text-slate-100 mt-0.5">Pipeline</h1>
          <p className="text-[12.5px] text-slate-400 mt-1">All active and recent opportunities. Discovery agent surfaces new SAM.gov / SBIR / agency-portal items every 15 minutes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="violet" dot><AIBadge size="xs" /> 12 new from agent · last sync 8 min ago</Pill>
          <Button variant="primary" size="md" icon={<Icon.Plus size={13} />}>Add opportunity</Button>
        </div>
      </div>

      {/* Filter bar */}
      <Card className="mb-3">
        <div className="flex items-center gap-2 px-3 py-2.5 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 mr-1 inline-flex items-center gap-1.5"><Icon.Filter size={11} /> Filters</span>
          <Filter label="Status" k="status" options={allStatuses} />
          <Filter label="Agency" k="agency" options={allAgencies} />
          <Filter label="Product" k="product" options={allProducts} />
          <Filter label="Owner" k="owner" options={allOwners} />
          <span className="ml-auto text-[11px] text-slate-500">
            {filtered.length} of {window.OPPORTUNITIES.length} shown
          </span>
        </div>
      </Card>

      {/* Bulk actions strip */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-[12px] text-cyan-200">
          <Icon.Check size={13} />
          <span>{selected.size} selected</span>
          <span className="flex-1" />
          <Button size="xs" variant="accept" icon={<Icon.Check size={11} />}>Pursue</Button>
          <Button size="xs" variant="reject" icon={<Icon.X size={11} />}>Reject</Button>
          <Button size="xs" variant="modify" icon={<Icon.Star size={11} />}>Save for later</Button>
          <button onClick={() => setSelected(new Set())} className="text-[11px] text-cyan-300 hover:text-cyan-100">Clear</button>
        </div>
      )}

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="text-[10px] uppercase tracking-wider text-slate-500">
              <tr className="border-b border-slate-800">
                <th className="w-8 px-3 py-2.5">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll} className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500" />
                </th>
                <th className="px-2 py-2.5 text-left">Title</th>
                <th className="px-2 py-2.5 text-left">Solicitation #</th>
                <th className="px-2 py-2.5 text-left">Agency</th>
                <th className="px-2 py-2.5 text-right">Ceiling</th>
                <th className="px-2 py-2.5 text-left">Deadline</th>
                <th className="px-2 py-2.5 text-left">Status</th>
                <th className="px-2 py-2.5 text-left">Stage</th>
                <th className="px-2 py-2.5 text-left">Product</th>
                <th className="px-3 py-2.5 text-left">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((o) => {
                const isSel = selected.has(o.id);
                return (
                  <tr key={o.id}
                    className={`group cursor-pointer transition-colors ${isSel ? 'bg-cyan-500/5' : 'hover:bg-slate-800/40'}`}
                    onClick={() => onOpenOpp(o.id)}>
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={isSel} onChange={() => toggle(o.id)}
                        className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500" />
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="text-slate-100 font-medium leading-tight">{o.title}</div>
                      {o.inferred && <div className="text-[10.5px] text-slate-500 mt-0.5">{o.inferred}</div>}
                    </td>
                    <td className="px-2 py-2.5"><Mono className="text-[11px] text-slate-400">{o.sol}</Mono></td>
                    <td className="px-2 py-2.5 text-slate-300">{o.agency}</td>
                    <td className="px-2 py-2.5 text-right"><MoneyMono value={o.ceiling} className="text-slate-200" /></td>
                    <td className="px-2 py-2.5"><DeadlineChip days={o.deadlineDays} /></td>
                    <td className="px-2 py-2.5"><StatusPill status={o.status} /></td>
                    <td className="px-2 py-2.5"><StageDots stage={o.stage} /></td>
                    <td className="px-2 py-2.5"><ProductPill name={o.productLine} /></td>
                    <td className="px-3 py-2.5">{o.owner ? <Avatar id={o.owner} size={20} /> : <span className="text-slate-600">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-3 text-[10.5px] text-slate-500">Tip: <KBD>↵</KBD> on a row to open the workspace · <KBD>P</KBD> to pursue · <KBD>R</KBD> to reject.</p>
    </div>
  );
}

window.Pipeline = Pipeline;
