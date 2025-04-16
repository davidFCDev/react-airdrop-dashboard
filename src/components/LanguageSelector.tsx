import { Select, SelectItem } from "@heroui/select";

import i18n from "@/i18n";

const LanguageSelector = () => {
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    i18n.changeLanguage(event.target.value);
  };

  const languages = [
    { key: "en", label: "EN" },
    { key: "es", label: "ES" },
  ];
  const defaultLanguage =
    languages.find((lang) => lang.key === i18n.language) || languages[0];

  return (
    <Select
      aria-label="Language Selector"
      className="w-20"
      defaultSelectedKeys={[defaultLanguage.key]}
      variant="bordered"
      onChange={handleLanguageChange}
    >
      {languages.map((lang) => (
        <SelectItem key={lang.key} textValue={lang.label}>
          {lang.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default LanguageSelector;
