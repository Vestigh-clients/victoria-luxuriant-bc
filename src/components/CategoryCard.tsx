import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
}

const CategoryCard = ({ name, slug, imageUrl }: CategoryCardProps) => {
  const normalizedImageUrl = imageUrl.trim();
  const hasImage = normalizedImageUrl.length > 0;

  return (
    <Link to={`/category/${encodeURIComponent(slug)}`} className="group lux-surface-card flex h-full flex-col overflow-hidden text-current">
      <div className="overflow-hidden bg-[rgba(var(--color-primary-rgb),0.03)]">
        {hasImage ? (
          <img
            src={normalizedImageUrl}
            alt={name}
            className="aspect-[3/4] w-full object-cover transition-all ease-in-out [transition-duration:400ms] group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="aspect-[3/4] w-full bg-[rgba(var(--color-primary-rgb),0.08)]" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-5 pt-4 md:px-5">
        <h3 className="text-left font-display text-[20px] font-normal leading-snug text-foreground">{name}</h3>
        <p className="mt-2 text-left font-body text-[13px] font-medium text-[var(--color-accent)]">Shop now</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
