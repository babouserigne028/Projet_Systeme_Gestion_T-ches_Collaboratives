import TabBtn from "./TabBtn";

const TabsHeader = ({ tab, setTab, response }) => {
  return (
    <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm overflow-x-auto">
      <TabBtn id="overview" label="Vue d'ensemble" cur={tab} set={setTab} />
      <TabBtn
        id="pending"
        label="Validations"
        cur={tab}
        set={setTab}
        badge={response?.Non_validé}
      />
      <TabBtn id="teachers" label="Stats Professeurs" cur={tab} set={setTab} />
    </div>
  );
};

export default TabsHeader;
