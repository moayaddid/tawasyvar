import Link from "next/link";
import { useRouter } from "next/router";
import { RiEnglishInput } from "react-icons/ri";

export default function LocaleSwitcher({color}) {
  const router = useRouter();

  const { locales, locale: activeLocale } = router;

  const otherLocales = locales?.filter((locale) => locale !== activeLocale);

  return (
    <span className="text-muted cursor-pointer">
      {otherLocales?.map((locale) => {
        const { pathname, query, asPath } = router;
        return (
          <span key={"locale-" + locale}>
            <Link
              href={{ pathname, query }}
              as={asPath}
              locale={locale}
              className={`px-2  ${color ? color : `text-white`}`}
            >
              {locale === "en" ? (
                <RiEnglishInput className="sm:w-[20px] sm:h-[20px] w-[14px] h-[14px] mx-5 " />
              ) : locale === "ar" ? (
                <p className="sm:text-xl text-sm mx-5 " >عربى</p>
              ) : null}
            </Link>
          </span>
        );
      })}
    </span>
  );
}
