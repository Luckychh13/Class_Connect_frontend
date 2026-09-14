import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ClassDetails, User, UserRole } from '@/types'
import { useCustomMutation, useGetIdentity, useNotification, useShow } from '@refinedev/core'
import {AdvancedImage} from "@cloudinary/react"
import { bannerPhoto } from '@/lib/cloudinary'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BACKEND_BASE_URL } from '@/constants'

const Show = () => {
    const {query} = useShow<ClassDetails>({resource:'classes'})
    const classDetails = query.data?.data
    const {isLoading, isError} = query

    const { data: identity } = useGetIdentity<User>()
    const isStudent = identity?.role === UserRole.STUDENT

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [inviteCodeInput, setInviteCodeInput] = useState('')
    const { open } = useNotification()
    const { mutate: joinClass, isPending: isJoining } = useCustomMutation()

        const handleJoinClass = () => {
        if (!inviteCodeInput.trim()) {
            open?.({
                type: 'error',
                message: 'Invite code required',
                description: 'Please enter an invite code to join a class.',
            })
            return
        }

                joinClass(
            {
                url: `${BACKEND_BASE_URL}enrollments`,
                method: 'post',
                values: { inviteCode: inviteCodeInput.trim() },
                config: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            },
            {
                onSuccess: () => {
                    open?.({
                        type: 'success',
                        message: 'Joined class',
                        description: 'You have successfully joined the class.',
                    })
                    setIsDialogOpen(false)
                    setInviteCodeInput('')
                    query.refetch()
                },
                onError: (error: any) => {
                    open?.({
                        type: 'error',
                        message: 'Failed to join class',
                        description: error?.message ?? 'Please check your invite code and try again.',
                    })
                },
            }
        )
    }

    if(isLoading || isError || !classDetails) {
        return (
            <ShowView className='class-view class-show'>
                <ShowViewHeader resource='classes' title='Class Details'/>

                <p className='state-message'>
                    {isLoading ? 'Loading class details... '
                        : isError ? 'Failed to load class details'
                            :'Class details not found'}
                </p>
            </ShowView>
        )
    }

    const teacherName = classDetails.teacher?.name ?? 'Unknown'
    const teacherInitials = 
        teacherName
            .split(' ')
            .filter(Boolean)
            .slice(0,2)
            .map((part) => part[0]?.toUpperCase())
            .join('')
    const placeholderUrl = `https://placehold.co/600*400?text=${encodeURIComponent(teacherInitials || 'NA')}`
    const {name, description, status, capacity, bannerCldPubId, bannerUrl, subject, teacher, department,schedules, inviteCode} = classDetails        
  return (
    <ShowView className='class-view class-show'>
        <ShowViewHeader resource='classes' title='Class Details' />

        <div className='banner'>
            {bannerUrl ? (
                <AdvancedImage alt='Class Banner' cldImg={bannerPhoto(bannerCldPubId ?? '',name)} />
            ) : <div className='placeholder'/>}
        </div>

        <Card className='details-card'>
            <div className='details-header'>
                <div>
                    <h1>{name}</h1>
                    <p>{description}</p>
                </div>
                <div>
                    <Badge variant="outline">{capacity}</Badge>
                    
                    
                    <Badge variant={status=='active' ? 'default' : 'secondary'} data-status={status}>{status.toUpperCase()}</Badge>
                </div>
            </div>

            <div className='details-grid'>
                <div className='instructor'>
                    <p>Instructor</p>
                    <div>
                        <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />

                        <div>
                            <p>{teacherName}</p>
                            <p>{teacher?.email}</p>
                        </div>
                    </div>
                </div>

                <div className='department'>
                    <p>Department</p>

                    <div>
                        <p>{department?.name}</p>
                        <p>{department?.description}</p>
                    </div>
                </div>
            </div>

            <Separator />

            <div className='subject'>
                <p>Subject</p>

                <div>
                    <Badge variant='outline'>Code: {subject?.code}</Badge>
                    <p>{subject?.name}</p>
                    <p>{subject?.description}</p>
                </div>
            </div>

             <Separator />

                {isStudent && (
          <>
            <div className="join">
              <h2>🎓 Join Class</h2>

              <ol>
                <li>Ask your teacher for the invite code.</li>
                <li>Click on &quot;Join Class&quot; button.</li>
                <li>Paste the code and click &quot;Join&quot;</li>
              </ol>
            </div>

            <Button size="lg" className="w-full" onClick={() => setIsDialogOpen(true)}>
              Join Class
            </Button>
          </>
        )}
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Class</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2 py-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
                            <Input
                id="inviteCode"
                placeholder="Enter invite code"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleJoinClass()
                }}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoinClass} disabled={isJoining}>
                {isJoining ? 'Joining...' : 'Join'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </ShowView>
  )
}

export default Show
