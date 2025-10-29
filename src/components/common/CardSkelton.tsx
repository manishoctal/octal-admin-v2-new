import { Card, CardContent } from '../ui/card'

const CardSkelton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
  )
}

export default CardSkelton