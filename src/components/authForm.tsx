import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";

type AuthFormProps = {
  title: string;
  subtitle: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errorMessage: string | null;
  linkText: string;
  linkHref: string;
};

export default function AuthForm({
  title,
  subtitle,
  onSubmit,
  errorMessage,
  linkText,
  linkHref,
}: AuthFormProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full min-w-80 flex flex-col items-start justify-center">
      <div className="flex flex-col gap-2 max-w-xs mx-auto text-left mb-4">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>

      <Divider className="w-full" />

      <Form
        className="w-full max-w-xs flex flex-col gap-4 my-6"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        <Input
          isRequired
          errorMessage={t("form.mailError")}
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder={t("form.emailPlaceholder")}
          type="email"
        />

        <Input
          isRequired
          errorMessage={t("form.passwordError")}
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder={t("form.passwordPlaceholder")}
          type="password"
        />

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <div className="flex gap-2">
          <Button color="primary" type="submit" variant="solid">
            {t("form.submit")}
          </Button>
          <Button type="reset" variant="light">
            {t("form.reset")}
          </Button>
        </div>
      </Form>

      <Divider className="w-full" />

      <div className="mt-6 text-sm flex items-center justify-between w-full font-light">
        {linkText}
        <Link
          className="text-primary hover:underline font-normal"
          href={linkHref}
        >
          {t("form.clickHere")}
        </Link>
      </div>
    </div>
  );
}
