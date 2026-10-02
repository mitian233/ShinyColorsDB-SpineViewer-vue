import { mount, enableAutoUnmount } from '@vue/test-utils'
import { afterEach, describe, it, expect } from 'vitest'
import AnimationPanel from '../AnimationPanel.vue'
import type { AnimationItem } from '../../types'

enableAutoUnmount(afterEach)

describe('AnimationPanel.vue', () => {
  const animations: AnimationItem[] = [
    { name: 'wait', trackIndex: 0, checked: true },
    { name: 'talk', trackIndex: 4, checked: false },
    { name: 'smile', trackIndex: 8, checked: false },
  ]

  it('renders animation labels and controlled checkbox states', async () => {
    const wrapper = mount(AnimationPanel, { props: { animations } })
    const checkboxes = wrapper.findAll('[role="checkbox"]')
    expect(checkboxes).toHaveLength(3)
    expect(checkboxes[0]!.attributes('aria-label')).toBe('wait')
    expect(checkboxes[0]!.attributes('aria-checked')).toBe('true')
    expect(checkboxes[1]!.attributes('aria-checked')).toBe('false')
    await wrapper.setProps({
      animations: animations.map((animation) => ({ ...animation, checked: true })),
    })
    expect(checkboxes[1]!.attributes('aria-checked')).toBe('true')
  })

  it('emits the animation track index when a checkbox is clicked', async () => {
    const wrapper = mount(AnimationPanel, { props: { animations } })
    await wrapper.findAll('[role="checkbox"]')[1]!.trigger('click')
    expect(wrapper.emitted('toggle')).toEqual([[4, true]])
    await wrapper.findAll('[role="checkbox"]')[0]!.trigger('click')
    expect(wrapper.emitted('toggle')![1]).toEqual([0, false])
  })

  it('emits reset and close actions', async () => {
    const wrapper = mount(AnimationPanel, { props: { animations } })
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'リセット')!
      .trigger('click')
    expect(wrapper.emitted('reset')).toEqual([[]])
    await wrapper
      .findAll('button')
      .find((button) => button.text() === '閉じる')!
      .trigger('click')
    expect(wrapper.emitted('close')).toEqual([[]])
  })
})
