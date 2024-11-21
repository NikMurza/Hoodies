import OCHelmet from "lib/OCHelmet"
import { ReactElement } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { ForumNoticeView } from "./ForumNoticeView"
import { SystemNoticeView } from "./SystemNoticeView"
import { HandsChatView } from "./chat/HandsChatView"
import { FollowingView } from "./following/FollowingView"
import { SharedHandsView } from "./sharing/hands/SharedHandsView"
import { SharedSimsView } from "./sharing/simulations/SharedSimsView"

export function ActivityCenterTab(): ReactElement {
  return (
    <>
      <OCHelmet title="Activity Center" />

      <Routes>
        <Route path="" element={<Navigate to={"sharing"} replace />} />
        <Route path="/sharing/*">
          <Route path="" element={<Navigate to={"hands"} replace />} />
          <Route path="hands" element={<SharedHandsView />} />
          <Route path="simulations" element={<SharedSimsView />} />
        </Route>

        <Route path="/following" element={<FollowingView />} />
        <Route path="/chat">
          <Route path="" element={<Navigate to={"hands"} replace />} />
          <Route path="hands" element={<HandsChatView />} />
        </Route>
        <Route path="/system" element={<SystemNoticeView />} />
        <Route path="/forum" element={<ForumNoticeView />} />
      </Routes>
    </>
  )
}
