export default function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center p-2 select-none">
      <img
        src="/hero-illustration.png"
        srcSet="https://onlinetestpaper.com/wp-content/uploads/2021/01/Online-Test-Paper-back-300x238.png 300w, /hero-illustration.png 618w"
        sizes="(max-width: 640px) 300px, 618px"
        alt="Online Mock Test Paper Assessment Illustration"
        className="w-full h-auto object-contain max-h-[420px]"
        loading="eager"
      />
    </div>
  );
}
