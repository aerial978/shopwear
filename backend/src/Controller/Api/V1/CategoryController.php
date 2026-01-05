<?php

namespace App\Controller\Api\V1;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/categories')]
final class CategoryController extends AbstractController
{
    #[Route('', name: 'api_categories_list', methods: ['GET'])]
    public function list(
        CategoryRepository $categoryRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $categories = $categoryRepository->findActiveOrdered();

        $json = $serializer->serialize($categories, 'json', [
            'groups' => ['category:list'],
        ]);

        return new JsonResponse(
            json_decode($json, true, 512, JSON_THROW_ON_ERROR),
            JsonResponse::HTTP_OK
        );
    }
}
