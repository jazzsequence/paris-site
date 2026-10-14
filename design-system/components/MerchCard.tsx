export function MerchCard({ name, price, image }: { name: string; price: string; image: string }) {
  return (
    <div className="group space-y-3">
      <div className="aspect-square overflow-hidden rounded-card border border-line bg-surface">
        <img src={image} alt={name} className="size-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide">{name}</h3>
        <p className="tabular-nums text-cyan">{price}</p>
      </div>
    </div>
  );
}
