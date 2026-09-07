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
    <header className="relative aspect-6/1 overflow-hidden rounded-medium">
      <img
        alt=""
        className="absolute inset-0 size-full object-cover object-right"
        src={backgroundImage}
      />

      <div className="relative flex size-full flex-col justify-end p-5 text-white">
        <h1 className="bold display24">{title}</h1>
        <p className="medium display14 mt-2 text-white/80">{description}</p>
      </div>
    </header>
  );
};

export default HeroBanner;
