import { useSignIn, useSignUp, useClerk } from "@clerk/clerk-react";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "./EyeIcons";

import { useNavigate } from "react-router-dom";

export default function LoginCard() {
  /*
  |------------------------------------------------------------------
  | CLERK
  |------------------------------------------------------------------
  */

  const { signIn, setActive, isLoaded: signInLoaded } = useSignIn();

  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const { signOut } = useClerk();

  const navigate = useNavigate();

  /*
  |------------------------------------------------------------------
  | STATES
  |------------------------------------------------------------------
  */

  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [username, setUsername] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [code, setCode] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  /*
  |------------------------------------------------------------------
  | CONTINUAR EMAIL
  |------------------------------------------------------------------
  */

  const handleContinueEmail = (e) => {
    e.preventDefault();

    if (!email) {
      return setError("Ingresá tu email o nombre de usuario");
    }

    setError("");

    setPassword("");

    setStep("password");
  };

  /*
  |------------------------------------------------------------------
  | LOGIN
  |------------------------------------------------------------------
  */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!signInLoaded) return;

    setLoading(true);

    setError("");

    try {
      const result = await signIn.create({
        identifier: email,

        password,
      });

      console.log(result);

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });

        navigate("/mapa");
      }
    } catch (err) {
      console.log(err);

      setError(err.errors?.[0]?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  /*
  |------------------------------------------------------------------
  | GOOGLE LOGIN
  |------------------------------------------------------------------
  */

  const handleGoogle = async () => {
    if (!signInLoaded) return;

    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",

      redirectUrl: "/sso-callback",

      redirectUrlComplete: "/mapa",
    });
  };

  /*
  |------------------------------------------------------------------
  | REGISTER
  |------------------------------------------------------------------
  */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!signUpLoaded) return;

    /*
  |--------------------------------------------------
  | VALIDACIONES
  |--------------------------------------------------
  */

    if (!username || !email || !password) {
      return setError("Completá todos los campos");
    }

    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    if (password.length < 8) {
      return setError("La contraseña debe tener al menos 8 caracteres");
    }

    setLoading(true);

    setError("");

    try {
      /*
    |--------------------------------------------------
    | CREAR USUARIO
    |--------------------------------------------------
    */

      const result = await signUp.create({
        username,
        emailAddress: email,
        password,
      });

      console.log("SIGNUP CREADO:", result);

      /*
      |--------------------------------------------------
      | Si Clerk ya completó el signup
      |--------------------------------------------------
      */

      if (result.status === "complete") {

        await signOut();

        alert(
          "Cuenta creada correctamente. Ahora iniciá sesión."
        );

        setStep("email");

        return;
      }

      /*
      |--------------------------------------------------
      | Si necesita verificación
      |--------------------------------------------------
      */

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setStep("verify");
    } catch (err) {
      console.log(err);

      setError(err.errors?.[0]?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  /*
  |------------------------------------------------------------------
  | VERIFY EMAIL
  |------------------------------------------------------------------
  */

  /*
|------------------------------------------------------------------
| VERIFY EMAIL
|------------------------------------------------------------------
*/

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!signUpLoaded) return;

    setLoading(true);

    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      console.log(result);

      /*
    |--------------------------------------------------
    | VERIFY COMPLETO
    |--------------------------------------------------
    */

      if (result.status === "complete") {
        /*
      |--------------------------------------------------
      | Cerrar sesión automática de Clerk
      |--------------------------------------------------
      */

        await signOut();

        /*
      |--------------------------------------------------
      | Limpiar states
      |--------------------------------------------------
      */

        setCode("");

        setPassword("");

        setConfirmPassword("");

        /*
      |--------------------------------------------------
      | Volver al login
      |--------------------------------------------------
      */

        setStep("email");

        /*
      |--------------------------------------------------
      | Mensaje
      |--------------------------------------------------
      */

        alert("Cuenta creada correctamente. Ahora iniciá sesión.");
      }
    } catch (err) {
      console.log(err);

      setError(err.errors?.[0]?.message || "Código incorrecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 px-6 pt-16">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-xs sm:max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-1">
          Urban
          <span className="text-blue-500">Log</span>
        </h1>

        {/* ===================================================== */}
        {/* EMAIL */}
        {/* ===================================================== */}

        {step === "email" && (
          <form onSubmit={handleContinueEmail} className="flex flex-col gap-4">
            <p className="text-center text-gray-500 text-sm">
              Por favor loguearse para continuar
            </p>

            <button
              type="button"
              onClick={handleGoogle}
              className="flex items-center justify-center gap-3 border border-gray-700 rounded-full py-2 px-4 text-gray-800 font-medium hover:bg-gray-100 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continuar con Google
            </button>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <hr className="flex-1 border-gray-300" />
              O
              <hr className="flex-1 border-gray-300" />
            </div>

            <input
              type="text"
              placeholder="Email o nombre de usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 rounded-full py-2 px-4 text-sm outline-none focus:border-blue-500 bg-white/70"
            />

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-2 transition-colors"
            >
              Continuar
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("register");

                setError("");

                setPassword("");

                setConfirmPassword("");
              }}
              className="border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold rounded-full py-2 transition-colors"
            >
              Registrarse
            </button>
          </form>
        )}

        {/* ===================================================== */}
        {/* PASSWORD */}
        {/* ===================================================== */}

        {step === "password" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <p className="text-center text-gray-500 text-sm">
              Por favor loguearse para continuar
            </p>

            <button
              type="button"
              onClick={() => {
                setStep("email");

                setError("");
              }}
              className="border border-gray-400 rounded-full py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
            >
              Cambiar método
            </button>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-400 rounded-full py-2 px-4 pr-10 text-sm outline-none focus:border-blue-500 w-full bg-white/70"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-2 transition-colors disabled:opacity-60"
            >
              {loading ? "Cargando..." : "Continuar"}
            </button>
          </form>
        )}

        {/* ===================================================== */}
        {/* REGISTER */}
        {/* ===================================================== */}

        {step === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <p className="text-center text-gray-500 text-sm">
              Creá tu cuenta para continuar
            </p>

            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-400 rounded-full py-2 px-4 text-sm outline-none focus:border-blue-500 bg-white/70"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 rounded-full py-2 px-4 text-sm outline-none focus:border-blue-500 bg-white/70"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-400 rounded-full py-2 px-4 pr-10 text-sm outline-none focus:border-blue-500 w-full bg-white/70"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-400 rounded-full py-2 px-4 pr-10 text-sm outline-none focus:border-blue-500 w-full bg-white/70"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <div id="clerk-captcha"></div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-2 transition-colors disabled:opacity-60"
            >
              {loading ? "Cargando..." : "Registrarse"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="text-gray-600 text-sm text-center hover:underline"
            >
              Ya tengo cuenta
            </button>
          </form>
        )}

        {/* ===================================================== */}
        {/* VERIFY */}
        {/* ===================================================== */}

        {step === "verify" && (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <p className="text-center text-gray-500 text-sm">
              Te enviamos un código a tu email
            </p>

            <input
              type="text"
              placeholder="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-400 rounded-full py-2 px-4 text-sm outline-none focus:border-blue-500 bg-white/70 text-center"
            />

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-2 transition-colors disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Confirmar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
