/* eslint-disable no-console */
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { FC, KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { DeleteIcon } from "./icons";

import { useUserAuth } from "@/context/AuthContext";
import { useTGEData } from "@/hooks/useTGEData";

const YEARS = [2023, 2024, 2025, 2026];
const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TGEs: FC = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAirdropId, setSelectedAirdropId] = useState<string>("");
  const {
    tgeAssignments,
    airdrops,
    isAdmin,
    loading,
    error,
    assignTGE,
    removeTGE,
  } = useTGEData(year, month);

  // Log para depurar airdrops
  console.log("Airdrops in TGEs:", airdrops);

  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Lunes como primer día
    const calendarDays: Array<{ date: string; day: number | null }> = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push({ date: "", day: null });
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      calendarDays.push({ date, day });
    }

    // Días vacíos al final
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push({ date: "", day: null });
    }

    return calendarDays;
  };

  const calendarDays = getCalendarDays();

  const handleAssignTGE = async () => {
    if (!selectedDate || !selectedAirdropId) {
      addToast({ title: t("tge.select_airdrop"), color: "danger" });

      return;
    }

    const airdrop = airdrops.find((a) => a.id === selectedAirdropId);

    if (!airdrop) {
      addToast({ title: t("tge.airdrop_not_found"), color: "danger" });

      return;
    }

    try {
      await assignTGE(selectedDate, airdrop);
      setIsModalOpen(false);
      setSelectedAirdropId("");
      addToast({ title: t("tge.assigned_success"), color: "success" });
    } catch (error) {
      addToast({ title: t("tge.assign_error"), color: "danger" });
    }
  };

  const handleRemoveTGE = async (date: string, airdropId: string) => {
    try {
      await removeTGE(date, airdropId);
      addToast({ title: t("tge.removed_success"), color: "success" });
    } catch (error) {
      addToast({ title: t("tge.remove_error"), color: "danger" });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, date: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAssignModal(date);
    }
  };

  const openAssignModal = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handlePreviousMonth = () => {
    setMonth((prev) => {
      if (prev === 1) {
        setYear((y) => y - 1);

        return 12;
      }

      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setMonth((prev) => {
      if (prev === 12) {
        setYear((y) => y + 1);

        return 1;
      }

      return prev + 1;
    });
  };

  // Manejo de usuario no autenticado
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-neutral-100 text-xl">{t("auth.please_login")}</p>
          <Button as={Link} className="mt-4" color="primary" to="/login">
            {t("navbar.login")}
          </Button>
        </div>
      </div>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-xl">
            {t("tge.error")}: {error}
          </p>
          <Button
            className="mt-4"
            color="primary"
            onPress={() => window.location.reload()}
          >
            {t("tge.retry")}
          </Button>
        </div>
      </div>
    );
  }

  // Mostrar spinner durante carga
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen">
        <Spinner className="mx-auto" size="lg" />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-start w-full">
      <div className="w-full max-w-7xl">
        <div className="w-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-4">
              <Select
                className=" max-w-[100px]"
                label={t("tge.year")}
                selectedKeys={[year.toString()]}
                variant="bordered"
                onSelectionChange={(keys) =>
                  setYear(parseInt([...keys][0] as string))
                }
              >
                {YEARS.map((y) => (
                  <SelectItem key={y}>{y.toString()}</SelectItem>
                ))}
              </Select>
              <Select
                className=" max-w-[140px]"
                label={t("tge.month")}
                selectedKeys={[month.toString()]}
                variant="bordered"
                onSelectionChange={(keys) =>
                  setMonth(parseInt([...keys][0] as string))
                }
              >
                {MONTHS.map((m) => (
                  <SelectItem key={m.value}>
                    {t(`tge.months.${m.label.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="p-2 border border-default-200 bg-default-100 text-center font-semibold text-neutral-300 text-xl"
                >
                  {t(`tge.days.${day.toLowerCase()}`)}
                </div>
              ))}
              {calendarDays.map(({ date, day }, index) => {
                const assignments = date ? tgeAssignments.get(date) || [] : [];

                return (
                  <div
                    key={index}
                    aria-label={
                      day && isAdmin
                        ? `${t("tge.assign_airdrop")} for ${day}/${month}/${year}`
                        : undefined
                    }
                    className={`p-4 border border-default-200 h-48 flex flex-col items-start justify-between
                      ${day ? "bg-default-50" : "bg-default-100"}
                      ${day && isAdmin ? "cursor-pointer hover:bg-default-100" : ""}`}
                    role={day && isAdmin ? "button" : undefined}
                    tabIndex={day && isAdmin ? 0 : undefined}
                    onClick={
                      day && isAdmin ? () => openAssignModal(date) : undefined
                    }
                    onKeyDown={
                      day && isAdmin ? (e) => handleKeyDown(e, date) : undefined
                    }
                  >
                    {day ? (
                      <>
                        <span className="text-neutral-100">{day}</span>
                        <div className="flex flex-col gap-2 w-full h-full overflow-y-auto pt-2">
                          {assignments.map((assignment) => (
                            <div
                              key={assignment.airdropId}
                              className="flex items-center gap-2"
                            >
                              <img
                                alt={assignment.airdropName}
                                className="w-6 h-6 object-cover rounded-lg"
                                src={
                                  assignment.airdropImage ||
                                  "/images/placeholder.png"
                                }
                              />
                              <span className=" font-semibold text-neutral-300 truncate flex-1">
                                {assignment.airdropName}
                              </span>
                              {isAdmin && (
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() =>
                                    handleRemoveTGE(date, assignment.airdropId)
                                  }
                                >
                                  <DeleteIcon
                                    className="text-red-500"
                                    size={16}
                                  />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                aria-label={t("tge.previous_month")}
                color="primary"
                variant="light"
                onPress={handlePreviousMonth}
              >
                {t("tge.previous_month")}
              </Button>
              <Button
                aria-label={t("tge.next_month")}
                color="primary"
                variant="light"
                onPress={handleNextMonth}
              >
                {t("tge.next_month")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para asignar airdrop */}
      <Modal
        backdrop="opaque"
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <ModalContent>
          <ModalHeader>{t("tge.assign_airdrop")}</ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <label
                className="block text-neutral-300 mb-2"
                htmlFor="airdrop-select"
              >
                {t("tge.select_airdrop")}
              </label>
              <select
                className="w-full p-2 border border-default-200 rounded-md bg-default-50 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                id="airdrop-select"
                value={selectedAirdropId}
                onChange={(e) => setSelectedAirdropId(e.target.value)}
              >
                <option disabled value="">
                  {t("tge.select_airdrop")}
                </option>
                {airdrops.length === 0 ? (
                  <option disabled value="no-airdrops">
                    {t("tge.no_airdrops_available")}
                  </option>
                ) : (
                  airdrops.map((airdrop) => {
                    console.log("Rendering option:", airdrop.id, airdrop.name);

                    return (
                      <option key={airdrop.id} value={airdrop.id}>
                        {airdrop.name}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                setIsModalOpen(false);
                setSelectedAirdropId("");
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              color="primary"
              disabled={!selectedAirdropId}
              onPress={handleAssignTGE}
            >
              {t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default TGEs;
