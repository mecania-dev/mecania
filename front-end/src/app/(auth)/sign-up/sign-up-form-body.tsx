import { useFormContext } from 'react-hook-form'

import { Card } from '@/components/card'
import { SignUpRequest } from '@/types/auth'
import { Tab, Tabs } from '@nextui-org/react'

import { SignUpCustomerFormBody } from './sign-up-customer-form-body'
import { SignUpMechanicFormBody } from './sign-up-mechanic-form-body'

export function SignUpFormBody() {
  const { watch, reset } = useFormContext<SignUpRequest>()
  const values = watch()
  const isMechanic = values.groups?.includes('Mechanic')

  function onUserTypeChange(key: React.Key) {
    reset({ groups: key === 'mechanic' ? ['Mechanic'] : ['Driver'] })
  }

  return (
    <Card isHoverable={false}>
      <Card.Body>
        <Tabs selectedKey={isMechanic ? 'mechanic' : 'driver'} onSelectionChange={onUserTypeChange} fullWidth>
          <Tab title="Motorista" key="driver">
            <SignUpCustomerFormBody />
          </Tab>
          <Tab title="Oficina" key="mechanic">
            <SignUpMechanicFormBody />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  )
}
