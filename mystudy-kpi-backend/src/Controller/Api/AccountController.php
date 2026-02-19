<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\AccountUpdateDto;
use App\Dto\PasswordUpdateDto;
use App\Entity\User;
use App\Service\AccountService;
use App\Service\CookieService;
use App\Serializer\UserResponseSerializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/account')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
final class AccountController extends AbstractController
{
    public function __construct(
        private readonly AccountService $accountService,
        private readonly UserResponseSerializer $userResponseSerializer,
        private readonly CookieService $cookieService,
    ) {
    }

    #[Route('', name: 'api_account_update', methods: ['PATCH'])]
    public function update(#[MapRequestPayload] AccountUpdateDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $updatedUser = $this->accountService->updateAccount($user, $dto);

        return $this->json([
            'message' => 'Account updated successfully.',
            'user' => $this->userResponseSerializer->serialize($updatedUser),
        ]);
    }

    #[Route('/password', name: 'api_account_password', methods: ['PATCH'])]
    public function updatePassword(#[MapRequestPayload] PasswordUpdateDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $this->accountService->updatePassword($user, $dto);

        return $this->json(['message' => 'Password updated successfully.']);
    }

    #[Route('', name: 'api_account_delete', methods: ['DELETE'])]
    public function delete(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $this->accountService->deleteAccount($user);

        $response = $this->json(['message' => 'Account deleted successfully.']);
        $response->headers->setCookie($this->cookieService->clearAuthCookie());

        return $response;
    }
}
