interface IHeroBannerProps {
  backgroundImage: string;
  description: string;
  title: string;
}

const HeroBanner = ({
  backgroundImage,
  description,
  title,
}: IHeroBannerProps) => {
  return (
    <header className="relative tab:aspect-6/1 min-h-32 tab:min-h-0 overflow-hidden rounded-medium">
      <img
        alt=""
        className="absolute inset-0 size-full object-cover object-right"
        src={backgroundImage}
      />

      <div className="relative flex size-full min-h-32 tab:min-h-0 flex-col justify-end p-4 tab:p-5 text-white">
        <h1 className="bold display20 tab:display24">{title}</h1>
        <p className="medium display12 tab:display14 mt-1 tab:mt-2 text-white/80">
          {description}
        </p>
      </div>
    </header>
  );
};

export default HeroBanner;
