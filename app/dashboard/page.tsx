import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, MessageSquare, Settings, BarChart } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">TeleGuard</span>
        </div>
        <nav className="ml-auto flex gap-2">
          <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <span className="sr-only">Settings</span>
            <Settings className="h-4 w-4" />
          </a>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r bg-muted/40 md:flex">
          <nav className="grid gap-2 p-4 text-sm">
            <a href="#" className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground">
              <BarChart className="h-4 w-4" />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Users className="h-4 w-4" />
              Groups
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Shield className="h-4 w-4" />
              Moderation
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </a>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spam Blocked</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commands Used</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Performance</CardTitle>
                  <CardDescription>Response time and command usage over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-t">
                  <div className="text-center text-muted-foreground">
                    <p>Performance chart would appear here</p>
                    <p className="text-sm">Average response time: 0.2s</p>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest bot actions and events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full w-8 h-8 bg-primary/20 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Spam message removed</p>
                          <p className="text-xs text-muted-foreground">Group: Tech Chat • 5 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="rounded-full w-8 h-8 bg-primary/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">New user welcomed</p>
                          <p className="text-xs text-muted-foreground">Group: Gaming Club • 15 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="rounded-full w-8 h-8 bg-primary/20 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Command executed</p>
                          <p className="text-xs text-muted-foreground">Group: Photography • 30 min ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Top Groups</CardTitle>
                    <CardDescription>Most active groups by message volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full w-8 h-8 bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700">TC</span>
                          </div>
                          <p className="text-sm font-medium">Tech Chat</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2,345 msgs</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full w-8 h-8 bg-green-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-green-700">GC</span>
                          </div>
                          <p className="text-sm font-medium">Gaming Club</p>
                        </div>
                        <p className="text-sm text-muted-foreground">1,892 msgs</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full w-8 h-8 bg-purple-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-700">PH</span>
                          </div>
                          <p className="text-sm font-medium">Photography</p>
                        </div>
                        <p className="text-sm text-muted-foreground">1,456 msgs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Bot Health</CardTitle>
                    <CardDescription>System performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">CPU Usage</p>
                          <p className="text-sm text-muted-foreground">12%</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[12%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Memory Usage</p>
                          <p className="text-sm text-muted-foreground">28%</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[28%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Uptime</p>
                          <p className="text-sm text-muted-foreground">99.9%</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[99.9%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="groups" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Managed Groups</CardTitle>
                  <CardDescription>All Telegram groups managed by TeleGuard</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Tech Chat</h3>
                          <p className="text-sm text-muted-foreground">ID: 123456789</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                          <button className="text-sm text-blue-600 hover:underline">Manage</button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Gaming Club</h3>
                          <p className="text-sm text-muted-foreground">ID: 987654321</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                          <button className="text-sm text-blue-600 hover:underline">Manage</button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Photography</h3>
                          <p className="text-sm text-muted-foreground">ID: 456789123</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                          <button className="text-sm text-blue-600 hover:underline">Manage</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="moderation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Moderation Actions</CardTitle>
                  <CardDescription>Recent moderation activities across all groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">User Banned</h3>
                          <p className="text-sm text-muted-foreground">User ID: 12345 • Group: Tech Chat</p>
                        </div>
                        <div className="text-sm text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Message Deleted</h3>
                          <p className="text-sm text-muted-foreground">Spam content • Group: Gaming Club</p>
                        </div>
                        <div className="text-sm text-muted-foreground">5 hours ago</div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">User Warned</h3>
                          <p className="text-sm text-muted-foreground">User ID: 67890 • Group: Photography</p>
                        </div>
                        <div className="text-sm text-muted-foreground">1 day ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

