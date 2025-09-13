'use client';

type ExperienceCardContentProps = {
  title: string;
  description: string;
};

export function ExperienceCardContent({
  title,
  description,
}: ExperienceCardContentProps) {
  return (
    <>
      <h3 className="font-headline text-xl font-semibold text-primary">
        {title}
      </h3>
      <p className="mt-2 text-foreground/80">{description}</p>
    </>
  );
}
