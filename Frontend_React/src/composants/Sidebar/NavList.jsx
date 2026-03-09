import NavItem from "./NavItem";
import SectionLabel from "./SectionLabel";

/* ─── NavList Component ─────────────────────────────────────────── */
function NavList({ open, menu, onNav }) {
  return (
    <ul className="flex flex-col gap-0.5 px-3">
      <SectionLabel label="Menu" isOpen={open} />
      {menu.map((item, i) => (
        <NavItem
          key={item.to}
          item={item}
          isOpen={open}
          onClick={onNav}
          delay={i * 40}
        />
      ))}
    </ul>
  );
}

export default NavList;
