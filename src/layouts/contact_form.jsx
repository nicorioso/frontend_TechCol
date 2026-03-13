import { useMemo, useState } from "react";
import MainHeader from "../components/IU/headers/Main";
import MainFooter from "../components/IU/footers/MainFooter";
import SeoHead from "../seo/SeoHead";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [submitState, setSubmitState] = useState({
    isSubmitting: false,
    error: "",
    success: "",
  });

  const isFormValid = useMemo(() => {
    return (
      formValues.fullName.trim().length >= 2 &&
      EMAIL_REGEX.test(formValues.email.trim()) &&
      formValues.message.trim().length >= 10
    );
  }, [formValues.email, formValues.fullName, formValues.message]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setSubmitState((prev) => ({ ...prev, error: "", success: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      setSubmitState((prev) => ({
        ...prev,
        error: "Completa correctamente el nombre, correo y descripcion del requerimiento.",
      }));
      return;
    }

    setSubmitState({ isSubmitting: true, error: "", success: "" });

    try {
      // Placeholder: integrar service real cuando exista endpoint de contacto.
      await Promise.resolve();
      setFormValues(INITIAL_FORM);
      setSubmitState({
        isSubmitting: false,
        error: "",
        success: "Solicitud enviada. Nuestro equipo te contactara pronto.",
      });
    } catch {
      setSubmitState({
        isSubmitting: false,
        error: "No fue posible enviar la solicitud. Intenta nuevamente.",
        success: "",
      });
    }
  };

  return (
    <>
      <SeoHead routeKey="contact" />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <MainHeader />

        <section className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h1 className="mb-3 text-center text-3xl font-bold text-slate-900 dark:text-gray-100">
              Asesoria para Componentes de Computador
            </h1>
            <p className="mb-6 text-center text-sm text-slate-600 dark:text-gray-300">
              Cuentanos que equipo quieres armar y te ayudamos a elegir partes PC compatibles para
              gaming, productividad o trabajo profesional en Colombia.
            </p>

            <form className="space-y-5" aria-label="Formulario de asesoramiento" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-gray-200">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-gray-200">
                  Correo electronico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="ejemplo@mail.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-gray-200">
                  Que componentes necesitas?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ejemplo: busco una GPU para jugar en 1440p y una fuente recomendada"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              {(submitState.error || submitState.success) && (
                <p
                  className={`rounded-md border px-3 py-2 text-sm ${
                    submitState.error
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                  role={submitState.error ? "alert" : "status"}
                  aria-live="polite"
                >
                  {submitState.error || submitState.success}
                </p>
              )}

              <button
                type="submit"
                disabled={submitState.isSubmitting || !isFormValid}
                className="w-full rounded-lg bg-cyan-600 py-2 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-400"
              >
                {submitState.isSubmitting ? "Enviando..." : "Solicitar asesoramiento"}
              </button>
            </form>
          </article>
        </section>

        <MainFooter />
      </main>
    </>
  );
}

export default ContactForm;
