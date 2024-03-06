import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RiEnglishInput } from "react-icons/ri";

export default function LocaleSwitcher({color}) {
  const router = useRouter();

  const { locales, locale: activeLocale } = router;

  const otherLocales = locales?.filter((locale) => locale !== activeLocale);


  return (
    <span className="text-muted cursor-pointer">
      {otherLocales?.map((locale , i) => {
        const { pathname, query, asPath } = router;
        let path = '' ;
        if (locale === `en`) {
          path = asPath ;
        }else if (locale == `ar`){
          path = `/ar${asPath}`
        }  
        return (
          <span key={i} >
            <a href={path}  className={`px-2 text-white`}>
            {locale === "en" ? (
                <RiEnglishInput className="sm:w-[20px] sm:h-[20px] w-[14px] h-[14px] mx-5 " />
              ) : locale === "ar" ? (
                <p className="sm:text-xl text-sm mx-5 " >عربى</p>
              ) : null}
          </a>
            {/* <Link
              href={{ pathname, query }}
              locale={locale}
              prefetch = {false}
              className={`px-2  ${color ? color : `text-white`}`}
            >
              {locale === "en" ? (
                <RiEnglishInput className="sm:w-[20px] sm:h-[20px] w-[14px] h-[14px] mx-5 " />
              ) : locale === "ar" ? (
                <p className="sm:text-xl text-sm mx-5 " >عربى</p>
              ) : null}
            </Link> */}
          </span>
        );
      })}
    </span>
  );
}
