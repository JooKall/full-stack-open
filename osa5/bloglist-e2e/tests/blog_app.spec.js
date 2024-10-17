const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Joonas',
        username: 'jkal',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('jkal')
      await page.getByTestId('password').fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Joonas logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('jkal')
      await page.getByTestId('password').fill('wrong')

      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Joonas logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'jkal', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'testTitle', 'testAuthor', 'testUrl.com')
      await expect(page.getByText('testTitle testAuthor')).toBeVisible()
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'testTitle1', 'testAuthor1', '1testUrl.com')
        await createBlog(page, 'testTitle2', 'testAuthor2', '2testUrl.com')
        await createBlog(page, 'testTitle3', 'testAuthor3', '3testUrl.com')
      })

      test('a blog can be liked', async ({ page }) => {
        const blogText = await page.getByText('testTitle1 testAuthor1')
        await blogText.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes: 0')).toBeVisible()

        await blogText.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })

      test('a blog can be deleted by the user who added it', async ({ page }) => {
        const blogText = await page.getByText('testTitle2 testAuthor2')
        await blogText.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('remove')).toBeVisible()

        page.on('dialog', dialog => dialog.accept())
        await blogText.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Blog deleted')).toBeVisible()
        await expect(page.getByText('testTitle2 testAuthor2')).not.toBeVisible()
      })

      test('a blog cannot be deleted by a different user', async ({ page, request }) => {
        const blog = await page.getByText('testTitle1 testAuthor1')
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('remove')).toBeVisible()

        await page.getByRole('button', { name: 'log out' }).click()
        await expect(page.getByText('Log out successful!')).toBeVisible()

        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'user',
            username: 'user',
            password: 'salainen'
          }
        })
        await loginWith(page, 'user', 'salainen')
        await expect(page.getByText('User logged in')).toBeVisible()

        const blogText = await page.getByText('testTitle1 testAuthor1')
        await blogText.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('remove')).not.toBeVisible()
      })

      test('blogs are sorted in descending order by likes', async ({ page }) => {

        for (const blogElement of await page.getByTestId('blog').all()) {
          const viewButton = await blogElement.getByRole('button', { name: 'view' })
          await viewButton.click()
        }

        const clickLikeAndCheck = async (blog, expectedLikes) => {
          await blog.getByRole('button', { name: 'like' }).click();
          await expect(blog.getByText(`likes: ${expectedLikes}`)).toBeVisible();
        }

        //Blog1: likes 3
        const blog1 = await page.getByText('testTitle1 testAuthor1')
        for (let i = 1; i <= 3; i++) {
          await clickLikeAndCheck(blog1, i)
        }

        //Blog2: likes 1
        const blog2 = await page.getByText('testTitle2 testAuthor2')
        for (let i = 1; i <= 1; i++) {
          await clickLikeAndCheck(blog2, i)
        }

        //Blog3: likes 4
        const blog3 = await page.getByText('testTitle3 testAuthor3')
        for (let i = 1; i <= 4; i++) {
          await clickLikeAndCheck(blog3, i)
        }

        const likesArray = []
        for (const blogElement of await page.getByTestId('blog').all()) {
          const likesText = await blogElement.getByText(/likes: \d+/).textContent()
          const number = likesText.replace('likes: ', '')
          const likes = parseInt(number)
          likesArray.push(likes)
        }

        for (let i = 0; i < likesArray.length - 1; i++) {
          expect(likesArray[i]).toBeGreaterThanOrEqual(likesArray[i + 1])
        }
      })
    })
  })
})
