"use client";
import { useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/empty-org";
import { BoardList } from "./_components/board-list";

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  }
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  searchParams,
}) => {

  const { organization } = useOrganization();

  return (
    <div className="bg-red-200 flex-1 h-[calc(100%-80px)] p-6">
      {/* {JSON.stringify(searchParams.favorites)} */}
      {!organization ?
        (<EmptyOrg />)
        : (
          <BoardList orgId={organization.id} query={searchParams}/>
        )
      }
    </div>
  )
}

export default DashboardPage;