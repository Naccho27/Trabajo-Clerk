import SignOutButton from "../Buttons/SignOutButton";

export default function Header() {
  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold">
        Urban<span className="text-blue-500">Log</span>
      </h1>
      <SignOutButton className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 hover:bg-gray-100" />
    </div>
  );
}